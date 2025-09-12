import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const deleteApi = async (note) => {
    const token = sessionStorage.getItem('token');
    const deletedNote = { ...note, updated_at: new Date().toISOString(), sync_status: "deleted", }
    try {
        console.log("Sending to backend: ", deletedNote)
        const response = await axios.post(`http://127.0.0.1:5000/api/v1/notes/sync`,
            { notes: [deletedNote] },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        await db.notes.delete(deletedNote.id);
        console.log(`Deleted note with id ${deletedNote.id} from IndexedDB`);
        return response.data;
    } catch (err) {
        console.error('Failed to sync delete note, saving as "deleted:', err);
        await db.notes.put(deletedNote);
        await db.mutations_queue.add({
            id: crypto.randomUUID(),
            type:'delete',
            note: deletedNote,
            timestamp: Date.now()
        })
        return deletedNote;
    }

    
}

export const useNoteDeleteMutation = (userName, queryClient) => {
    const mutation = useMutation({
        mutationFn: deleteApi,
        onMutate: async (targetNote) => {
            await queryClient.cancelQueries(['notes', userName])

            const previousNotes = queryClient.getQueryData(['notes', userName]);

            const updatedNotes = previousNotes?.filter((note) => note.id !== targetNote.id);

            queryClient.setQueryData(['notes', userName], updatedNotes);


            return { previousNotes }
        },
        onError: (error, deletedNote, context) => {
            if (context?.previousNotes)
                queryClient.setQueryData(['notes', userName], context.previousNotes);
        },
        onSettled: () => queryClient.invalidateQueries(['notes', userName])
    })

    return mutation;

}