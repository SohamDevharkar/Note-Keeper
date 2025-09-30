import { NoteInput } from "../components/my-components/NoteInput"
import { NoteLayout } from "../components/my-components/NoteLayout"
import { useQueryClient} from "@tanstack/react-query"
import { useFetchAndLoad } from "../hooks/useFetchAndLoad"
import { Spinner } from "../components/my-components/Loader"
import { isDev } from "../utils/devLoggerUtil"

export const NoteView = ({ sidebaropen,
  inputOpen,
  setInputOpen,
  setSelectedNote,
  view,
  isOnline
}) => {
  
  if(isDev()){console.count("NoteView rendered");}
  const queryClient = useQueryClient()
  const userName = sessionStorage.getItem('username');
  const {data: noteList = [], isLoading, error, isError} = useFetchAndLoad(queryClient, userName, isOnline);

  const filteredNotes = noteList.filter(note => note && note.view === 'notes') || [];

  if(isLoading) return <div className="flex flex-col justify-center w-full h-full items-center"><Spinner /></div>
  if(isError) return <div>Error Loading notes</div>

  return (<>
    <div className={`min-h-[100px] dark:bg-gray-900 transition-all w-full duration-300`}>
      <NoteInput inputOpen={inputOpen} 
        setInputOpen={setInputOpen} 
        isOnline={isOnline} />
    </div>
    <div className={`pt-8 min-h-[582px] flex flex-col ${sidebaropen ? 'w-full' : 'max-w-screen'} dark:bg-gray-900`}>
      <NoteLayout filteredNotes={filteredNotes} 
        sidebaropen={sidebaropen}
        setSelectedNote={setSelectedNote}
        view={view}
        isOnline={isOnline}
      />
    </div>
  </>)
}