import Dexie from 'dexie'

const db = new Dexie('NotesDatabase');

db.version(4).stores({
    notes: 'id, client_id, title, content, view, prevView, bgColor, pinned, user_id, created_at, updated_at, sync_status',
})

db.open().catch((err) => {
  console.error('Failed to open db:', err.stack || err);
});

db.on('blocked', () => console.warn('Dexie DB upgrade blocked!'));
db.on('ready', () => console.log('Dexie DB ready'));
db.on('populate', () => console.log('Database populated'));


const clearNotes = async () => {
    await db.notes.clear();
} 

export {db, clearNotes}