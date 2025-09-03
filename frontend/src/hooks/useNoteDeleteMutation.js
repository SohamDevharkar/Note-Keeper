import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const deleteApi = async (noteId) => {
    const token = sessionStorage.getItem('token');
    const respone = axios.delete(`http://127.0.0.1:5000/api/v1/notes/deleteNote/${noteId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    await db.notes.delete(noteId);
    return respone.data;
}

export const useNoteDeleteMutation = (userName, setNotes, queryClient) => {
    const mutation = useMutation({
        mutationFn: deleteApi,
        onMutate: async (noteId) => {
            await queryClient.cancelQueries(['notes', userName])

            const previousNotes = queryClient.getQueryData(['notes', userName]);

            const updatedNotes = previousNotes?.filter((note) => note.id != noteId);

            queryClient.setQueryData(['notes', userName], updatedNotes);

            if(setNotes) setNotes(updatedNotes);

            return { previousNotes }
        },
        onError: (error, noteId, context) => {
            if(context?.previousNotes)
            queryClient.setQueryData(['notes', userName], context.previousNotes);
            if(setNotes) setNotes(context.previousNotes)
        },
        onSettled:() => queryClient.invalidateQueries(['notes', userName])
    })

    return mutation;

}