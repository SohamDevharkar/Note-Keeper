import { NoteInput } from "../components/my-components/NoteInput"
import { NoteLayout } from "../components/my-components/NoteLayout"
import { useQueryClient} from "@tanstack/react-query"
import { useEffect } from 'react'
import { useFetchAndLoad } from "../hooks/useFetchAndLoad"

export const NoteView = ({ sidebaropen,
  inputOpen,
  notes,
  setNotes,
  setInputOpen,
  setSelectedNote,
  view,

}) => {
  const queryClient = useQueryClient()
  const userName = sessionStorage.getItem('username');
  const {data, isLoading, error, isError} =useFetchAndLoad(queryClient, userName);

  useEffect(() => {
    if(data && data.length > 0) {
      setNotes(data);
    }
  }, [data, setNotes])

  const filteredNotes = notes.filter(note => note && note.view === 'notes') || [];
  // console.log(`note view for ${userName}: ` + JSON.stringify(filteredNotes));

  if(isLoading) return <div>Loading notes....</div>
  if(isError) return <div>Error Loading notes</div>

  return (<>
    <div className={`min-h-[100px] dark:bg-gray-900 transition-all w-full duration-300`}>
      <NoteInput notes={notes} setNotes={setNotes} inputOpen={inputOpen} setInputOpen={setInputOpen} />
    </div>
    <div className={`pt-8 ${sidebaropen ? 'w-full' : 'max-w-screen'} dark:bg-gray-900  sm:w-full `}>
      <NoteLayout filteredNotes={filteredNotes} setNotes={setNotes}
        sidebaropen={sidebaropen}
        notes={notes}
        setSelectedNote={setSelectedNote}
        view={view}
      />
    </div>
  </>)
}