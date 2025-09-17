import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";
import { enqueueMutation } from "../utils/mutationQueue";

const deleteApi = async (noteToDelete) => {
    const token = sessionStorage.getItem('token');
    const deletedNote = { ...noteToDelete, updated_at: new Date().toISOString(), sync_status: "deleted", }
    if (!token) throw new Error("Token not found");

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
        const confirmedNote = response.data || []
        // await db.notes.delete(deletedNote.id);
        // console.log(`Deleted note with id ${deletedNote.id} from IndexedDB`);
        return [...confirmedNote];
    } catch (error) {
        console.error('Failed to sync delete note, saving as "deleted:', error);
        await db.notes.put(deletedNote);
        throw error;
    }
}

export const useNoteDeleteMutation = (userName, queryClient, isOnline) => {
    const mutation = useMutation({
        mutationFn: deleteApi,
        onMutate: async (targetNote) => {
            console.log("target note for deletion: ", targetNote);
            await queryClient.cancelQueries(['notes', userName])

            const optimisticNote = {
                ...targetNote,
                sync_status: 'deleted',
                updated_at: new Date().toISOString(),
            }

            // const updatedNotes = previousNotes?.filter((note) => note.id !== targetNote.id);
            console.log("delete optimistic note: ", optimisticNote);
            await db.notes.put(optimisticNote)

            queryClient.setQueryData(['notes', userName], (prevNotes = []) => {
                const filtered = prevNotes.filter(n => n.client_id !== optimisticNote.client_id);
                return [...filtered, optimisticNote].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            });
            const previousNotes = queryClient.getQueryData(['notes', userName]);

            if (!isOnline) {
                console.log("isOnline status for delete: ",isOnline )
                await enqueueMutation('delete', optimisticNote)
            }
            return { optimisticNote, previousNotes }
        },
        onSuccess: async (response, _, context) => {
            const confirmedNote = Array.isArray(response)
                ? response.find(n => n.client_id === context.optimisticNote.client_id)
                : context.optimisticNote;
            console.log('')
            await db.notes.delete(context.optimisticNote.client_id);

            queryClient.setQueryData(['notes', userName], (prev = []) => prev.filter(n => n.client_id !== confirmedNote.client_id))
        },
        onError: async (error, deletedNote, context) => {
            console.warn("Delete failed, keeping note as marked as deleted: ", error);
            const fallbackNote = {
                ...context.optimisticNote,
                sync_status: 'deleted',
                updated_at: new Date().toISOString(),
            };
            const filtered = context.previousNotes?.filter(n => n.client_id !== fallbackNote.client_id);
            const updatedNotes = [...filtered, fallbackNote].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            queryClient.setQueryData(['notes', userName], (prev = []) => prev.filter(n => n.client_id !== fallbackNote.client_id))

            await db.notes.put(...updatedNotes);
        },
        onSettled: async () => {
            const fresh = await db.notes.where('sync_status').notEqual('deleted').toArray();
            queryClient.setQueryData(['notes', userName], fresh);
        }
    })
    return mutation;
}