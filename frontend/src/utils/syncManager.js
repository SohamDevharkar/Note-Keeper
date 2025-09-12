import axios from "axios";
import { db } from "./indexedDB";

async function sendMutationToServer(mutation) {
    const token = sessionStorage.getItem('token');
    try {
        await axios.post('/api/v1/notes/sync', { notes: [mutation] }
            , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    } catch (error) {
        console.log("Error syncing mutation to server: ", error);
    }
}

const retryDelays = [1000];

async function sendMutationRetry(mutaton, maxRetries = retryDelays.length) {
    for( let attempt = 0; attempt < maxRetries; attempt++) {
        try{
            await sendMutationToServer(mutaton);
            return;
        } catch (error) {
            if(attempt === maxRetries-1) throw error;
            await new Promise(res => setTimeout(res, retryDelays[attempt]));
        }
    }
}

export const syncManager = async () => {
    const queue = await db.mutation_queue.toArray();
    if (queue.length > 0) {
        for (const mutation of queue) {
            try {
                await sendMutationToServer(mutation);
                await db.mutation_queue.delete(mutation.id);
            } catch (error) {
                // retry logic
                console.log("Error processing syncManager : ", error);
                sendMutationRetry(mutation);
                break;
            }
        }
    }
}