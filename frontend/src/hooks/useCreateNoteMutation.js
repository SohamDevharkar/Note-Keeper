import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";
import { enqueueMutation } from "../utils/mutationQueue";

const createNoteApi = async (noteData) => {
    console.log('hitting backend create note')
    const token = sessionStorage.getItem('token');
    console.log('noteData client_id before hitting backend: ', noteData?.client_id);
    const noteToSave = {
        ...noteData,
        updated_at: new Date().toISOString(),
        created_at: noteData.created_at || new Date().toISOString(),
    }

    if (!token) {
        throw new Error("Token not found in session storage");
    }

    try {
        console.log("hitting backend create note");
        const response = await axios.post('http://127.0.0.1:5000/api/v1/notes/sync',
            { notes: [noteToSave] },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        console.log("api response: " , response);
        const backendNotes = response.data|| [];
        return [...backendNotes];

    } catch (error) {
        console.error('Error in createNoteApi:', error);
        const pendingNote = { ...noteToSave, sync_status: 'pending' };
        await db.notes.put(pendingNote);
        throw error;
    }
}

export const useCreateNoteMutation = (userName, queryClient, isOnline) => {

    return useMutation({
        mutationFn: (note) => createNoteApi({ ...note }),
        onMutate: async (note) => {
            await queryClient.cancelQueries(['notes', userName]);
            const previousNoteList = queryClient.getQueryData(['notes', userName]);

            const optimisticNote = {
                ...note,
                updated_at: new Date().toISOString(),
                sync_status: 'pending'
            }

            await db.notes.put(optimisticNote);

            queryClient.setQueryData(['notes', userName], (oldNotes = []) => {
                const appendedNoteList =  [...oldNotes, optimisticNote];
                return appendedNoteList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            })

            if(!isOnline) {
                console.log("isOnline value for creating: ", isOnline)
                await enqueueMutation('create', optimisticNote)
            }

            return { previousNoteList, optimisticNote }
        },
        onSuccess: async (response, _, context) => {
            const confirmedNote = response.find(n=>n.client_id === context.optimisticNote.id)
            const optimisticNote = context.optimisticNote
            if (optimisticNote){
                await db.notes.delete(optimisticNote.id);
            }
            await db.notes.put(confirmedNote);
            queryClient.setQueryData(['notes', userName], (prevNotes = []) => {
                const filtered = prevNotes.filter(note => note.client_id !== confirmedNote.client_id);
                const appendedNoteList = [...filtered, confirmedNote];
                return appendedNoteList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            });


        },
        onError: (error, variables, context) => {
            console.warn('Mutation failed. Keeping note with pending status.', error);
            queryClient.setQueryData(['notes', userName], (prevNotes = []) => {
                const filtered = prevNotes.filter(n => n.client_id !== context.optimisticNote.client_id);
                const appendedNoteList = [...filtered, context.optimisticNote];
                return appendedNoteList.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            })
        },
        onSettled: async () => {
            const fresh = await db.notes.where('sync_status').notEqual('deleted').toArray();
            const freshSortedList = fresh.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            queryClient.setQueryData(['notes', userName], freshSortedList);
        }
    })
}