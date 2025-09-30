import axios from "axios";
import { db } from "./indexedDB";
import { isDev } from "./devLoggerUtil";
import baseUrl from "../utils/apiConfig"

export const enqueueMutation = async (type, note) => {

    const existingMutations = await db.mutationQueue.where('client_id').equals(note.client_id).toArray();
    if(isDev()){console.log("Existing mutations: ", existingMutations);}

    if (existingMutations.length > 0) {
        if(isDev()){console.log("updating existing mutation....")}
        const [existingMutation] = existingMutations;
        await db.mutationQueue.update(existingMutation.id, {
            type: type,
            note: { ...note },
            updated_at: new Date().toISOString(),
            status: 'pending'
        })
    } else {
        if(isDev()){console.log("creating new mutation....")}
        await db.mutationQueue.add({
            type: type,
            client_id: note.client_id,
            updated_at: new Date().toISOString(),
            note: { ...note },
            status: 'pending'
        })
    }
}

export const processMutationQueue = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    // below line added bcz mutation retyring logic pending.
    const pendingMutations = await db.mutationQueue.where('status').notEqual('synced').toArray();
    // const pendingMutations = await db.mutationQueue.toArray();
    if (isDev() && pendingMutations.length === 0 ) { console.log('No mutations to process. Queue is empty.');
    }

    for (const mutation of pendingMutations) {

        if(isDev()){console.log(`updating update_at prop for ${mutation.note.title}`)}
        try {
            const pendingNote = { ...mutation.note, updated_at: new Date().toISOString() }
            const response = await axios.post(`${baseUrl}/api/v1/notes/sync`,
                { notes: [pendingNote] },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            const confirmedNote = Array.isArray(response.data)
                ? response.data.find(n => n.client_id === mutation.client_id)
                : response.data;
            if(isDev()){console.log("confirmedNote received: ", confirmedNote);}
            // Apply confirmed mutation locally
            if (mutation.type === 'delete') {
                if(isDev()){console.log("actually deleting the note from indexedDB.")}
                await db.notes.delete(pendingNote.id);

            } else {
                const existingNote = await db.notes.get(mutation.client_id);
                const incomingNote = confirmedNote ? { ...confirmedNote, sync_status: "synced" } : { ...mutation.note, sync_status: 'pending' }
                if (!existingNote || new Date(incomingNote.updated_at) > new Date(existingNote.updated_at)) {
                    await db.notes.put(incomingNote);
                } else {
                    if(isDev()){console.log(`Skipped update: local note is newer than incoming`)}
                }
            }
            await db.mutationQueue.update(mutation.id, { ...mutation, status: 'synced' });
            if(isDev()){console.log("mutation successful for the ID: ", mutation.id);}
            await db.mutationQueue.delete(mutation.id);
        } catch (err) {
            if(isDev()){console.warn(`Failed to sync mutation ${mutation.id}:`, err);}
            await db.mutationQueue.update(mutation.id, { ...mutation, status: 'failed' });
        }
    }
};
