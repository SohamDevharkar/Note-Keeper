import axios from "axios";
import { db } from '../utils/indexedDB'
import { useQuery } from "@tanstack/react-query";


export const useFetchAndLoad = (queryClient, userName, isOnline) => {
    // const token = sessionStorage.getItem('token');

    // const fetchNotesApi = useCallback(async () => {
    //     console.log("Fetching notes from API for user: ", userName);
    //     const response = await axios.get('http://127.0.0.1:5000/api/v1/notes', {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //     // console.log("response data: " + response.data)
    //     return response.data;
    // }, [userName, token]);

    // const isError = queryClient.getQueryState(['notes', userName])?.isError;
    // const {isReady} = useNetworkAndBackendStatus(isError);
    // const { data, isLoading, error } = useQuery({
    //     queryKey: ['notes', userName],
    //     queryFn: fetchNotesApi,
    //     staleTime: 1 * 60 * 1000,
    //     cacheTime: 2 * 60 * 1000,
    //     retry: 0,
    //     enabled: navigator.onLine
    // });

    // const loadFromIndexedDB = useCallback(async () => {
    //     // const cachedNotes = await db.notes.where('sync_status')
    //     //         .notEqual('deleted').toArray();
    //     if (!isReady) {
    //         console.log("Loading notes from IndexedDB for user: ", userName);
    //         const localNotes = await db.notes.where('sync_status').notEqual('deleted').toArray();
    //         queryClient.setQueryData(['notes', userName], localNotes);
    //     }
    // }, [isError, queryClient, userName])


    // const cacheNotes = useCallback(async () => {
    //     const pendingNotes = await db.notes.where('sync_status').equals('pending').toArray();

    //     const syncedNotes = await Promise.all(data.map(async backendNote => {
    //         const localNote = await db.notes.get(backendNote.id);

    //         if (localNote?.sync_status === 'deleted') {
    //             return;
    //         }
    //         if (localNote?.sync_status === 'pending') {
    //             const localUpdatedAt = new Date(localNote.updated_at);
    //             const backendUpdatedAt = new Date(backendNote.updated_at);
    //             if (localUpdatedAt > backendUpdatedAt) {
    //                 return;
    //             }
    //         }
    //         const syncedNote = { ...backendNote, sync_status: 'synced' };
    //         await db.notes.put({ ...backendNote, sync_status: 'synced' });
    //         return syncedNote;
    //     }));
    //     const finalNotes = [...syncedNotes.filter(Boolean), ...pendingNotes];
    //     // queryClient.setQueryData(['notes', userName], finalNotes);
    //     // console.log("notes in react-query after caching: ", finalNotes);

    //     const existingNotes = queryClient.getQueryData(['notes', userName]);
    //     const notesChanged = JSON.stringify(existingNotes) !== JSON.stringify(finalNotes);
    //     if (notesChanged) {
    //         queryClient.setQueryData(['notes', userName], finalNotes);
    //         console.log("✅ Notes cached into React Query:", finalNotes);
    //     } else {
    //         console.log("Notes Unchanged avoiding cache updates");
    //     }
    // }, [data, queryClient, userName])

    // useEffect(() => {
    //     loadFromIndexedDB();
    //     if (data) {
    //         cacheNotes();
    //     }
    // }, [loadFromIndexedDB, cacheNotes]);

    // useEffect(() => {
    //     if (data) {
    //         cacheNotes();
    //     }
    // }, [cacheNotes,data])

    // const cachedNotes = queryClient.getQueryData(['notes', userName]) || [];

    // return {
    //     data: cachedNotes || [],
    //     isLoading: isLoading && !queryClient.getQueryData(['notes', userName]),
    //     error,
    //     isError
    // }
    // console.log("Backend status (isOnline): ", isOnline);

    // return useQuery({
    //     queryKey: ['notes', userName],
    //     queryFn: async () => {
    //         if (isOnline) {
    //             try {
    //                 const response = await axios.get('http://localhost:5000/api/v1/notes',
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${sessionStorage.getItem('token')}`
    //                         }
    //                     }
    //                 );
    //                 // console.log("Raw backend notes:", response.data);

    //                 const backendNotes = response.data || [];
    //                 console.log("Fetched notes from backend: ", backendNotes.filter(note => note.sync_status !== 'deleted'));

    //                 for( const note of backendNotes) {
    //                     console.log("client_id receive for Note from DB: ", note.client_id)
    //                     await db.notes.where('client_id').equals(note.client_id).delete()
    //                 }

    //                 console.log("Notes after dedup", db.notes.toArray())
    //                 await db.notes.bulkPut(backendNotes.map(note => ({ ...note, sync_status: 'synced' })))

    //                 console.log("Notes after bulkput", await db.notes.toArray())
    //                 //await db.notes.where('client_id').equals

    //                 let notesList = await db.notes.toArray();
    //                 console.log("cached notes in indexedDB: ", notesList);

    //                 queryClient.setQueryData(['notes', userName], notesList);


    //                 console.log("✅ Notes cached into React Query:", queryClient.getQueryData(['notes', userName]));

    //                 return notesList;

    //             } catch (error) {
    //                 console.log("Error Backend fetch failed, moving to offline mode: ", error);
    //             }
    //         }

    //         const loadNotes = await db.notes.toArray();
    //         return loadNotes.filter(note => note.sync_status !== 'deleted');
    //     },
    //     enabled: !useMutationState({
    //         filters: { mutationKey: ['createNote']},
    //         select: (m) => m.state.status === 'pending'
    //     }).some(Boolean),

    //     staleTime: 60_000,
    //     // retry: 0,
    //     retry: (failerCount, error) => navigator.online && failerCount < 3,
    //     retryDelay: attemptIndex => Math.min(1000 * 2 * attemptIndex, 10_000),
    // })

    async function fetchNotes() {
        const token = sessionStorage.getItem('token');
        if (isOnline) {
            // hit backend for fetch
            try {
                const response = await axios.get('http://localhost:5000/api/v1/notes',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                const backendNotes = response.data || [];
                const backendFiltered = backendNotes?.filter(note => note.synced_status !== 'deleted') || [];

                for (const note of backendFiltered) {
                    if (typeof note?.client_id === 'string' && note.client_id) {
                        await db.notes.where('client_id').equals(note.client_id).delete();
                    } else {
                        console.warn("invalid client_id for deletion", note.client_id)
                    }
                }
                await db.notes.bulkPut(backendFiltered);
                const cachedNotes = await db.notes.toArray()
                queryClient.setQueryData(['notes', userName], () => [cachedNotes]);
                return cachedNotes;

            } catch (error) {
                console.log("Error Backend fetch failed, moving to offline mode: ", error.message);
                const fallbackNotes = await db.notes.where('sync_status').notEqual('deleted').toArray();
                return fallbackNotes; 
            }
        } else {
            const response = db.notes.where('sync_status').notEquals('deleted').toArray();
            // return response;
            const localNotes = response;
            queryClient.setQueryData(['notes', userName], () => [...localNotes])
            return localNotes;
        }
    }

    const query = useQuery({
        queryKey: ['notes', userName],
        queryFn: () => fetchNotes()
    })

    return query
}