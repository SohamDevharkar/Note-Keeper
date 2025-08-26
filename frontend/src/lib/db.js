import Dexie from 'dexie'

const db = new Dexie('notesDatabase');

db.version(1).stores({
    notes: 'id, title, content, view, prevView, bgColor, pinned, user_id'
})

export default db;