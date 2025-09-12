// import { useMutation } from "@tanstack/react-query";
// import { db } from "../utils/indexedDB";
// import axios from "axios";

// const createNoteApi = async (noteData) => {
//     console.log('hitting backend create note')
//     const token = sessionStorage.getItem('token'); console.log('current token: ' + token);
//     if (!token) {
//         throw new Error("Token not found in session storage"); 
//     }

//     if(!navigator.onLine) {
//         throw new Error("Offline - cannot create note on server");
//     }

//     const noteToSave = {
//         ...noteData,
//         updated_at: new Date().toISOString(),
//         created_at: noteData.created_at || new Date().toISOString(),
//         sync_status: 'synced'
//     }

//     try {
//         const response = await axios.post('http://127.0.0.1:5000/api/v1/notes/sync', 
//             {notes: [noteToSave] }, 
//             {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         });
//         console.log("newNote.data response: ", response.data)

//         const savedNote = response.data[0] || noteToSave;
//         await db.notes.put(savedNote);

//         return [savedNote];
//         //return response.data;

//     } catch (error) {
//         console.error('Error in createNoteApi:', error);
//         const pendingNote = { ...noteToSave, sync_status: 'pending'};
//         await db.notes.put(pendingNote);
//         await db.mutations_queue.add({
//             id: crypto.randomUUID(),
//             type: 'create',
//             note: pendingNote,
//             timestamp: Date.now(),
//         })

//         return [pendingNote];
//     }

// }

// export const useCreateNoteMutation = (userName, queryClient) => {
//     return useMutation({
//             mutationFn: createNoteApi,
//             onMutate: (newNote) => {
//                 queryClient.cancelQueries(["notes", userName]);
//                 const previousNotes = queryClient.getQueryData(["notes", userName]) || [];
//                 queryClient.setQueryData(["notes", userName], [...previousNotes, newNote]);
//                 // db.notes.put(newNote);
//                 return { previousNotes };
//             },
//             onSuccess: (data) => {
//                 queryClient.setQueryData(["notes", userName], (old = []) => {
//                     const updatedNotes = data || [];
//                     const oldFiltered = old.filter(note => !updatedNotes.some(u => u.id === note.id));
//                     return [...oldFiltered, ...updatedNotes];
//                 });
//             },

//             onError: (error, newNote, context) => {
//                 if (context?.previousNotes) {
//                     queryClient.setQueryData(["notes", userName], context.previousNotes);
//                 }
//             },

//             onSettled: () => {
//                 queryClient.invalidateQueries(["notes", userName])
//             }
//         })
// }

// import { useMutation } from "@tanstack/react-query";
// import { db } from "../utils/indexedDB";
// import axios from "axios";

// const createNoteApi = async (noteData) => {
//   console.log('hitting backend create note');
//   const token = sessionStorage.getItem('token');

//   if (!token) {
//     throw new Error("Token not found in session storage");
//   }

//   const noteToSave = {
//     ...noteData,
//     updated_at: new Date().toISOString(),
//     created_at: noteData.created_at || new Date().toISOString(),
//     sync_status: 'synced'
//   };

//   try {
//     const response = await axios.post(
//       'http://127.0.0.1:5000/api/v1/notes/sync',
//       { notes: [noteToSave] },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     const savedNote = response.data[0] || noteToSave;

//     // ✅ Save to IndexedDB as synced
//     await db.notes.put({ ...savedNote, sync_status: 'synced' });

//     return [savedNote];

//   } catch (error) {
//     console.error('Error in createNoteApi:', error);

//     // ✅ Save as pending if request fails
//     const pendingNote = { ...noteToSave, sync_status: 'pending' };

//     await db.notes.put(pendingNote);

//     await db.mutations_queue.add({
//       id: crypto.randomUUID(),
//       type: 'create',
//       note: pendingNote,
//       timestamp: Date.now(),
//     });

//     return [pendingNote];
//   }
// };

// export const useCreateNoteMutation = (userName, queryClient) => {
//   return useMutation({
//     mutationFn: createNoteApi,

//     onMutate: async (newNote) => {
//       // ✅ Cancel any ongoing fetches
//       await queryClient.cancelQueries(["notes", userName]);

//       const previousNotes = queryClient.getQueryData(["notes", userName]) || [];

//       // ✅ Optimistically update cache only
//       queryClient.setQueryData(["notes", userName], [
//         ...previousNotes,
//         { ...newNote, sync_status: 'pending' },  // mark as pending for UI
//       ]);

//       return { previousNotes };
//     },

//     onSuccess: (data) => {
//       queryClient.setQueryData(["notes", userName], (old = []) => {
//         const updatedNotes = data || [];
//         const oldFiltered = old.filter(
//           (note) => !updatedNotes.some((u) => u.id === note.id)
//         );
//         return [...oldFiltered, ...updatedNotes];
//       });
//     },

//     onError: (error, newNote, context) => {
//       console.error("Create note failed:", error);

//       if (context?.previousNotes) {
//         queryClient.setQueryData(["notes", userName], context.previousNotes);
//       }
//     },

//     onSettled: () => {
//       if (navigator.onLine) {
//         queryClient.invalidateQueries(["notes", userName]);
//       }
//     }
//   });
// };


import { useMutation } from "@tanstack/react-query";
import { db } from "../utils/indexedDB";
import axios from "axios";

const createNoteApi = async (noteData) => {
    console.log('hitting backend create note')
    const token = sessionStorage.getItem('token');
    console.log('noteData client_id before hitting backend: ', noteData?.client_id);
    const noteToSave = {
        ...noteData,
        updated_at: new Date().toISOString(),
        created_at: noteData.created_at || new Date().toISOString(),
        // sync_status: isOnline ? 'synced' : 'pending'
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
        // console.log("data response: ", response.data)

        const savedNote = response.data[0] || noteToSave;
        // await db.notes.put({ ...savedNote, sync_status: 'synced' });
        console.log("NoteData client_id received after backend call: ", savedNote.client_id)
        return [savedNote];
        //return response.data;

    } catch (error) {
        console.error('Error in createNoteApi:', error);
        const pendingNote = { ...noteToSave, sync_status: 'pending' };
        await db.notes.put(pendingNote);
        return [pendingNote];
    }

}

export const useCreateNoteMutation = (userName, queryClient, isOnline) => {
    // const isError = queryClient.getQueryState(['notes', userName]);
    // console.log("isError value from previous query: ", isError);
    // const { isReady } = useNetworkAndBackendStatus(isError);
    // return useMutation({
    //     mutationFn: (noteData) => createNoteApi(noteData, isReady),
    //     onMutate: (newNote) => {
    //         queryClient.cancelQueries(["notes", userName]);
    //         const previousNotes = queryClient.getQueryData(["notes", userName]) || [];
    //         queryClient.setQueryData(["notes", userName], [...previousNotes, newNote]);
    //         console.log("Optimistically added cache data: ", queryClient.getQueryData(["notes", userName]));
    //         // db.notes.put(newNote);
    //         return { previousNotes };
    //     },
    //     onSuccess: (data) => {
    //         queryClient.setQueryData(["notes", userName], (old = []) => {
    //             const notesFromBackend = data || [];
    //             const oldFiltered = old.filter(note => !notesFromBackend.some(u => u.id === data.id));
    //             return [...oldFiltered, ...notesFromBackend];
    //         });
    //         console.log("Mutation succeeded: ");
    //     },

    //     onError: async (error, newNote, context) => {
    //         if (context?.previousNotes) {
    //             queryClient.setQueryData(["notes", userName], context.previousNotes);
    //         }

    // const pendingNote = { ...newNote, sync_status: 'pending' };

    // await db.notes.put(pendingNote);
    // await db.mutations_queue.add({
    //     id: crypto.randomUUID(),
    //     type: 'create',
    //     note: pendingNote,
    //     timestamp: Date.now(),
    // })
    // },

    // sync manager handling query cache invalidation.
    // onSettled: () => {
    //     queryClient.invalidateQueries(["notes", userName])
    // }
    // })
    //-------------------------------------------------------------------------------------------------------------------------------

    // return useMutation({
    //     mutationKey: ['createNote'],
    //     mutationFn: (noteData) =>  createNoteApi({ ...noteData }),
    //     onMutate: async (note) => {
    //         const client_id = crypto.randomUUID();
    //         await queryClient.cancelQueries(['notes', userName]);
    //         const previousNotes = queryClient.getQueryData(['notes', userName]) || [];

    //         const optimiticNote = {
    //             ...note,
    //             id: client_id,
    //             client_id: client_id,
    //             updated_at: new Date().toISOString(),
    //             sync_status: 'pending'
    //         }
    //         console.log("optimitic note saved to indexedDB: ", optimiticNote)
    //         await db.notes.put(optimiticNote);
    //         if (!isOnline) {
    //             queryClient.setQueryData(['notes', userName], (old = []) => [...old, optimiticNote]);
    //         }

    //         return { previousNotes, client_id };
    //     },
    //     onSuccess: async (data, variables, context) => {

    //         const confirmedNote = { ...data[0], sync_status: 'synced' };

    //         // Remove the optimistic note using client_id
    //         //await db.notes.where('client_id').equals(confirmedNote.client_id).delete();

    //         // Insert the confirmed note
    //         await db.notes.put(confirmedNote);


    //         queryClient.setQueryData(['notes', userName], (oldNotes = []) => (
    //             oldNotes.map(note => note.client_id === confirmedNote.client_id ? data?.[0] : note)
    //         ))

    //     },
    //     onError: (error, newNote, context) => {
    //         console.warn('Mutation failed. Keeping note with pending status.', error);
    //     },
    //     onSettled: async () => {
    //         const fresh = await db.notes.where('sync_status').notEqual('deleted').toArray();
    //         queryClient.setQueryData(['notes', userName], fresh);

    //         queryClient.invalidateQueries(['notes', userName]);
    //     }
    // })

    
    return useMutation({
        mutationFn: (note) => {
            createNoteApi({ ...note})
        },
        onMutate: async (note) => {
            await queryClient.cancelQueries(['notes', userName]);
            const previousNoteList = queryClient.getQueryData(['notes', userName]);

            const newNote = {
                ...note,
                //id: client_id,
                client_id: note.id,
                updated_at: new Date().toISOString(),
                sync_status: 'pending'
            }

            await db.notes.put(newNote);

            if (!isOnline) {
                queryClient.setQueryData(['notes', userName], (old = []) => {
                    return [...old, newNote];
                })
            }
            return { previousNoteList, newNote }
        },
        onSuccess: async (response, _, context) => {
            // queryClient.invalidateQueries(['notes', userName]);
            const confirmedNote = response?.data[0] || context.newNote;
            await db.notes.put(confirmedNote)
            queryClient.setQueryData(['notes', userName], (notes =[]) => notes.map(note => note.client_id === confirmedNote.client_id ? confirmedNote : note))
        },
        onError: (error, variables, context) => {
            console.warn('Mutation failed. Keeping note with pending status.', error);
            queryClient.setQueryData(['notes', userName], () => {
                return [...context.previousNoteList, context.newNote];
            })
        },
        onSettled: async () => {
            const fresh = await db.notes.where('sync_status').notEqual('deleted').toArray();
            queryClient.setQueryData(['notes', userName], fresh);
        }
    })
}