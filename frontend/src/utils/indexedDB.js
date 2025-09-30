import Dexie from 'dexie'
import { isDev } from './devLoggerUtil';

const db = new Dexie('NotesDatabase');

db.version(7).stores({
    notes: 'id, client_id, title, content, view, prevView, bgColor, pinned, user_id, created_at, updated_at, sync_status',
    mutationQueue: '++id, type, client_id, updated_at, status'

})

db.open().catch((err) => {
  if(isDev()){console.error('Failed to open db:', err.stack || err);}
});

db.on('blocked', () => {if(isDev()) console.warn('Dexie DB upgrade blocked!')});
db.on('ready', () => {if(isDev()) console.log('Dexie DB ready')});
db.on('populate', () => {if(isDev()) console.log('Database populated')});


const clearNotes = async () => {
    await db.notes.clear();
} 

const clearMutationQueue = async () =>{
  await db.mutationQueue.clear();
}

export {db, clearNotes}