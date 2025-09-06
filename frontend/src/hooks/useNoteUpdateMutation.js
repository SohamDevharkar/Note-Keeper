import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const updateNoteApi = async (updatedNote) => {
    
    //for testing
    console.log("updateNoteApi received:", updatedNote);

    const token = sessionStorage.getItem('token');
    // const response = await axios.patch(`http://127.0.0.1:5000/api/v1/notes/updateNote/${updatedNote.id}`, 
    //     updatedNote,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     }
    // )

    const response = await axios.post(`http://127.0.0.1:5000/api/v1/notes/sync`, 
        {notes: [updatedNote]},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    await db.notes.put(updatedNote);
    console.log("Saved to IndexedDB:", updatedNote);

    return response.data;
}

export const useNoteUpdateMutation = (userName, setNotes, queryClient) => {
    const mutation = useMutation({
        mutationFn: updateNoteApi,
        onMutate: async (updatedNote) => {
            await queryClient.cancelQueries(['notes', userName]);
            const previousNotes = queryClient.getQueryData(['notes', userName]);

            const updatedNotes = previousNotes.map(note => note.id === updatedNote.id ? updatedNote : note) || [updatedNote]

            // queryClient.setQueryData(['notes', userName], (old =[]) => 
            //     old.map(note => note.id === updatedNote.id ? updatedNote : note)
            // );

            // if(setNotes) {
            //     setNotes(prev => prev.map(note => note.id === updatedNote.id 
            //         ? updatedNote : note)
            //     );
            // }

            queryClient.setQueryData(['notes', userName], updatedNotes);
            if(setNotes) setNotes(updatedNotes);
            return { previousNotes }
        },

        onError: (error, updateNote, context) => {
            if(context?.previousNotes) {
                queryClient.setQueryData(['notes', userName], context.previousNotes);
                if(setNotes) setNotes(context.previousNotes)
            }
            console.error("Failed to update note: " , error);
        },

        onSettled: () => {
            queryClient.invalidateQueries(['notes', userName]);
        }
    });

    return mutation;
}