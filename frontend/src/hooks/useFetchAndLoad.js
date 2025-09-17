import axios from "axios";
import { db } from '../utils/indexedDB'
import { useQuery } from "@tanstack/react-query";

export const useFetchAndLoad = (queryClient, userName, isOnline) => {

    async function fetchNotes() {
        const token = sessionStorage.getItem('token');
        if (isOnline) {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/notes', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const backendNotes = response.data || [];
                const backendFiltered = backendNotes.filter(note => note.sync_status !== 'deleted');

                const localNotes = await db.notes.toArray();

                const mergedNotes = backendFiltered.map(backendNote => {
                    const localNote = localNotes.find(n => n.client_id === backendNote.client_id);

                    if (!localNote) return backendNote;
                    if (localNote.sync_status === 'deleted') return localNote;
                    const backendTime = new Date(backendNote.updated_at).getTime();
                    const localTime = new Date(localNote.updated_at).getTime()

                    // If local is newer, keep it and mark as pending
                    const timeDiff = localNote - backendTime;
                    console.log("timeDiff: ", timeDiff);
                    if (timeDiff > 0) {
                        return { ...localNote, sync_status: 'pending' }
                    } else {
                        return { ...backendNote, id: localNote.id, sync_status: 'synced' }
                    }

                    // return localTime > backendTime ? 
                    //      {...localNote, sync_status: 'pending'} : { ...backendNote, sync_status: 'synced' }; ;
                });
                console.log("mergedNotes: ", mergedNotes);
                // Include any local notes not present in backend
                const orphanLocals = localNotes.filter(local =>
                    !backendFiltered.some(note => note.client_id === local.client_id)
                );
                console.log("orphanedNotes: ", orphanLocals);

                const finalNotes = [...mergedNotes, ...orphanLocals].filter(n => n.sync_status != 'deleted');
                finalNotes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                // console.log('Final notes before bulkPut:', finalNotes);

                await db.notes.bulkPut(finalNotes);

                const allNotes = await db.notes.toArray();
                // console.log('IndexedDB notes after sync:', allNotes);

                queryClient.setQueryData(['notes', userName], finalNotes);
                return finalNotes;

            } catch (error) {
                console.log("Error Backend fetch failed, moving to offline mode: ", error.message);
                const fallbackNotes = await db.notes.where('sync_status').notEqual('deleted').toArray();
                return fallbackNotes;
            }
        } else {
            const localNotes = db.notes.where('sync_status').notEquals('deleted').toArray();
            // return response;
            queryClient.setQueryData(['notes', userName], localNotes)
            return localNotes;
        }
    }

    const query = useQuery({
        queryKey: ['notes', userName],
        queryFn: () => fetchNotes()
    })

    return query
}