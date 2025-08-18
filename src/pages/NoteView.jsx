import { NoteInput } from "../components/my-components/NoteInput"
import { NoteLayout } from "../components/my-components/NoteLayout"

export const NoteView = ({ sidebaropen,
  inputOpen,
  notes,
  setNotes,
  setInputOpen,
  setSelectedNote
}) => {

    const filteredNotes = notes.filter((note) => note.view === 'notes');

  return (<>
    <div className={`min-h-[80px] bg-orange-300 border-4 transition-all duration-100`}>
      <NoteInput notes={notes} setNotes={setNotes} inputOpen={inputOpen} setInputOpen={setInputOpen} />
    </div>
    <div className={`border-4 p-2 border-purple-600 ${sidebaropen ? 'max-w-[1300px]' : 'max-w-screen'}  sm:w-full`}>
      <NoteLayout filteredNotes={filteredNotes} setNotes={setNotes} 
        sidebaropen={sidebaropen}
        notes={notes}
        setSelectedNote={setSelectedNote}
        />
    </div>
  </>)
}