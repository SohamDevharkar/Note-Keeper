import axios from "axios";
import { db } from "./indexedDB";

export const enqueueMutation = async (type, note) => {
    const mutation = {
        type: type,
        client_id: note.client_id,
        updated_at: new Date().toISOString(),
        note: note,
        status: 'pending'
    }
    await db.mutationQueue.add(mutation);
    console.log(`Enqueued ${type} mutation for note ${note.client_id}`)
}

export const processMutationQueue = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error('Token not found');
    // below line added bcz mutation retyring logic pending.
    const pendingMutations = await db.mutationQueue.where('status').notEqual('synced').toArray();
    // const pendingMutations = await db.mutationQueue.toArray();
    if (pendingMutations.length === 0) {
        console.log('No mutations to process. Queue is empty.');
    }

    for (const mutation of pendingMutations) {
       
        console.log(`updating update_at prop for ${mutation.note.title}`)
        try {
            const pendingNote = {...mutation.note, updated_at: new Date().toISOString() }
            const response = await axios.post('http://127.0.0.1:5000/api/v1/notes/sync', {
                notes: [pendingNote]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const confirmedNote = Array.isArray(response.data)
                ? response.data.find(n => n.client_id === mutation.client_id)
                : response.data;

            // Apply confirmed mutation locally
            if (mutation.type === 'delete') {
                await db.notes.delete(pendingNote.id);
            } else {
                const existingNote = await db.notes.get(mutation.client_id);
                const incomingNote = confirmedNote ? {...confirmedNote , sync_status: "synced"} : {...mutation.note , sync_status: 'pending'}
                if (!existingNote || new Date(incomingNote.updated_at) > new Date(existingNote.updated_at)) {
                    await db.notes.put(incomingNote);
                } else {
                    console.log(`Skipped update: local note is newer than incoming`)
                }
            }
            await db.mutationQueue.update(mutation.id, { status: 'synced' });
        } catch (err) {
            console.warn(`Failed to sync mutation ${mutation.id}:`, err);
            await db.mutationQueue.update(mutation.id, { status: 'failed' });
        }
    }
};
