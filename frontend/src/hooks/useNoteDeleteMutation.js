import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const deleteApi = async (note) => {
    const token = sessionStorage.getItem('token');
    const deletedNote = { ...note, updated_at: new Date().toISOString(), sync_status: "deleted", }

    console.log("Sending to backend:", deletedNote)
    const respone = await axios.post(`http://127.0.0.1:5000/api/v1/notes/sync`,
        { notes: [deletedNote] },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    try {
        await db.notes.delete(deletedNote.id);
        console.log(`Deleted note with id ${deletedNote.id} from IndexedDB`);
    } catch (err) {
        console.error('Failed to delete note from IndexedDB:', err);
    }

    return respone.data;
}

export const useNoteDeleteMutation = (userName, setNotes, queryClient) => {
    const mutation = useMutation({
        mutationFn: deleteApi,
        onMutate: async (targetNote) => {
            await queryClient.cancelQueries(['notes', userName])

            const previousNotes = queryClient.getQueryData(['notes', userName]);

            const updatedNotes = previousNotes?.filter((note) => note.id != targetNote.id);

            queryClient.setQueryData(['notes', userName], updatedNotes);

            if (setNotes) setNotes(updatedNotes);

            return { previousNotes }
        },
        onError: (error, noteId, context) => {
            if (context?.previousNotes)
                queryClient.setQueryData(['notes', userName], context.previousNotes);
            if (setNotes) setNotes(context.previousNotes)
        },
        onSettled: () => queryClient.invalidateQueries(['notes', userName])
    })

    return mutation;

}