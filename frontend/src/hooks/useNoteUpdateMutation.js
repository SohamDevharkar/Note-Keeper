import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";
import { enqueueMutation } from "../utils/mutationQueue";
import { isDev } from "../utils/devLoggerUtil";
import baseUrl from "../utils/apiConfig";

const updateNoteApi = async (updatedNote) => {
    //for testing
    if(isDev()){console.log("updateNoteApi received:", updatedNote);}
    const token = sessionStorage.getItem('token');
    if(isDev()){console.log('updatedNote before hitting backend: ')}
    const updatedNoteToSave = {
        ...updatedNote,
        updated_at: new Date().toISOString(),
    }

    if (!token) {
        throw new Error("Token not found in session storage");
    }

    try {
        if(isDev()){console.log("Hitting backend update note")}
        const response = await axios.post(`${baseUrl}/api/v1/notes/sync`,
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
        if(isDev()){console.warn("Sync failed. Saving as pending:", error?.message || error);}
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

            if (!isOnline) {
                if(isDev()){console.log("isOnline status for updating: ", isOnline);}
                await enqueueMutation('update', optimisticNote)
            }

            return { previousNotes, optimisticNote };
        },
        onSuccess: async (response, _, context) => {
            if(isDev()){console.log("The response in onSuccess: ", response);}
            const confirmedNote = response.find(n => n.client_id === context.optimisticNote.client_id);
            if(isDev()){console.log("The confirmedNote I got: ", confirmedNote);}
            if(isDev()){console.log("The optimictic note I got: ", context.optimisticNote)}
            const optimisticNote = context.optimisticNote;

            await db.notes.update(optimisticNote.id, { ...confirmedNote, sync_status: 'synced' })
            queryClient.setQueryData(['notes', userName], (prev = []) => {
                const sortedUpdatedList = prev.map(note => note.client_id === confirmedNote.client_id ? confirmedNote : note)
                return sortedUpdatedList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            })
        },

        onError: async (error, _, context) => {
            if(isDev()){console.warn("Update failed,  keeping pending note:", error);}
            const fallbackNote = {
                ...context.optimisticNote,
                sync_status: 'pending',
                updated_at: new Date().toISOString()
            }
            await db.notes.put(fallbackNote);
            queryClient.setQueryData(['notes', userName], (prev = []) => {
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