import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const updateNoteApi = async (updatedNote) => {
    //for testing
    console.log("updateNoteApi received:", updatedNote);
    const newNoteToSave= {...updatedNote, 
        updated_at: new Date().toISOString(), 
        sync_status: 'synced'
    }

    const token = sessionStorage.getItem('token');
    
    try {
        const response = await axios.post(`http://127.0.0.1:5000/api/v1/notes/sync`,
            { notes: [newNoteToSave] },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        await db.notes.put(newNoteToSave);
        console.log("Saved to IndexedDB:", newNoteToSave);
        return response.data;

    } catch (error) {
        console.log("Sync failed. Saving as pending:", error?.message || error);
        const pendingNote = {...newNoteToSave, sync_status: 'pending'}
        await db.notes.put(pendingNote);
        await db.mutation_queue.add({
            id: crypto.randomUUID(),
            type: 'update',
            note: pendingNote,
            timestamp: Date.now()
        });
        return pendingNote;
    }
}

export const useNoteUpdateMutation = (userName, queryClient) => {
    const mutation = useMutation({
        mutationFn: updateNoteApi,
        onMutate: async (updatedNote) => {
            await queryClient.cancelQueries(['notes', userName]);
            const previousNotes = queryClient.getQueryData(['notes', userName]);

            const updatedNotes = previousNotes.map(note => note.id === updatedNote.id ? updatedNote : note) || [updatedNote]

            // queryClient.setQueryData(['notes', userName], (old =[]) => 
            //     old.map(note => note.id === updatedNote.id ? updatedNote : note)
            // );

         

            queryClient.setQueryData(['notes', userName], updatedNotes);
            return { previousNotes }
        },

        onError: (error, updateNote, context) => {
            if (context?.previousNotes) {
                queryClient.setQueryData(['notes', userName], context.previousNotes);
            }
            console.error("Failed to update note: ", error);
        },

        onSettled: () => {
            queryClient.invalidateQueries(['notes', userName]);
        }
    });

    return mutation;
}