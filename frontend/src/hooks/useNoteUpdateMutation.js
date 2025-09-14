import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const updateNoteApi = async (updatedNote) => {
    //for testing
    console.log("updateNoteApi received:", updatedNote);
    const token = sessionStorage.getItem('token');
    console.log('updatedNote before hitting backend: ')
    const updatedNoteToSave = {
        ...updatedNote,
        updated_at: new Date().toISOString(),
    }

    if (!token) {
        throw new Error("Token not found in session storage");
    }

    try {
        console.log("Hitting backend update note")
        const response = await axios.post(`http://127.0.0.1:5000/api/v1/notes/sync`,
            { notes: [updatedNoteToSave] },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        const backendNotes = response.data || [];
        return [...backendNotes];

    } catch (error) {
        console.log("Sync failed. Saving as pending:", error?.message || error);
        const pendingNote = { ...updatedNoteToSave, sync_status: 'pending' }
        await db.notes.put(pendingNote);
        throw error; //This should trigger onError
    }
}

export const useNoteUpdateMutation = (userName, queryClient, isOnline) => {
    const mutation = useMutation({
        mutationFn: updateNoteApi,
        onMutate: async (updatedNote) => {
            await queryClient.cancelQueries(['notes', userName]);
            const previousNotes = queryClient.getQueryData(['notes', userName]) || [];

            const optimisticNote = {
                ...updatedNote,
                updated_at: new Date().toISOString(),
                sync_status: 'pending'
            }

            await db.notes.put(optimisticNote)
            queryClient.setQueryData(['notes', userName], (prev = []) => {
                const sortedUpdatedList = prev.map(note => note.client_id === optimisticNote.client_id ? optimisticNote : note);
                return sortedUpdatedList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            })

            return { previousNotes, optimisticNote };
        },
        onSuccess: async (response, _, context) => {
            console.log("The response in onSuccess: ", response);
            const confirmedNote = response.find(n => n.client_id === context.optimisticNote.client_id);
            console.log("The confirmedNote I got: ", confirmedNote);
            console.log("The optimictic note I got: ", context.optimisticNote)
            const optimisticNote = context.optimisticNote;

            await db.notes.update(optimisticNote.id, { ...confirmedNote, sync_status: 'synced' })
            queryClient.setQueryData(['notes', userName], (prev = []) => {
                const sortedUpdatedList = prev.map(note => note.client_id === confirmedNote.client_id ? confirmedNote : note)
                return sortedUpdatedList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            })
        },

        onError: async (error, _, context) => {
            console.warn("Update failed,  keeping pending note:", error);
            const fallbackNote = {
                ...context.optimisticNote,
                sync_status: 'pending',
                updated_at: new Date().toISOString()
            }
            await db.notes.put(fallbackNote);
            queryClient.setQueryData(['notes', userName], (prev = []) =>{ 
                const sortedUpdatedList = prev.map(note => note.client_id === fallbackNote.client_id ? fallbackNote : note)
                return sortedUpdatedList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            });
        },

        onSettled: async () => {
            const fresh = await db.notes.where('sync_status').notEqual('deleted').toArray();
            const freshSortedList = fresh.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            queryClient.setQueryData(['notes', userName], freshSortedList);
        }
    });

    return mutation;
}