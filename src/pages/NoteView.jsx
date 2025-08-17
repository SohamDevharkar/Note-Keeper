import { NoteInput } from "../components/my-components/NoteInput"
import { NoteLayout } from "../components/my-components/NoteLayout"

export const NoteView = ({ sidebaropen,
    inputOpen,
    notes,
    setNotes,
    setInputOpen,
    viewFilter,
    setViewFilter }) => { 

    return (<>
        <div className={`min-h-[80px] bg-orange-300 border-4 transition-all duration-100`}>
            {
              viewFilter === 'notes' ? 
              <NoteInput notes={notes} setNotes={setNotes} inputOpen={inputOpen} setInputOpen={setInputOpen} /> :null
            }
            
          </div>
          <div className={`relative border-4  p-2 border-purple-600 ${sidebaropen ? 'max-w-[1300px]':'max-w-screen'}  sm:w-full`}>
            <NoteLayout notes={notes} setNotes={setNotes}
              sidebaropen={sidebaropen} 
              view={viewFilter}
              setViewFilter={setViewFilter}/>
          </div>
    </>)
}