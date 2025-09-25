import { RiInboxArchiveLine } from "react-icons/ri";
import { NoteLayout } from "../components/my-components/NoteLayout"
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAndLoad } from "../hooks/useFetchAndLoad";
import { Spinner } from "../components/my-components/Loader";

export const ArchiveView = ({
    sidebaropen,
    setSelectedNote,
    view,
    isOnline
}) => {

    const queryClient = useQueryClient()
    const userName = sessionStorage.getItem('username');
    const {data: noteList = [], isLoading, error, isError} = useFetchAndLoad(queryClient, userName, isOnline);


    const filteredArchiveNotes = noteList.filter((note) => note.view === 'archive');
    console.log(`archived view for ${userName}: ` + JSON.stringify(filteredArchiveNotes));

    function isArrayNullOrEmpty(filteredArchiveNotes) {
        return filteredArchiveNotes === null || 
            filteredArchiveNotes === undefined || 
            (Array.isArray(filteredArchiveNotes) && 
            filteredArchiveNotes.length === 0);
    }

    console.log("isArrayNullOrEmpty: " + isArrayNullOrEmpty(filteredArchiveNotes));

    if(isLoading) return <div className="flex flex-col justify-center w-full h-full items-center"><Spinner /></div>
    if(isError) return <div>Error Loading archived notes...</div>

    return <div className={`${isArrayNullOrEmpty(filteredArchiveNotes) ? 'fixed' : ''}  h-full sm:w-full`}>
        {
            isArrayNullOrEmpty(filteredArchiveNotes) ? (
                <div className="sticky flex flex-col items-center h-60 my-[12%] mx-[16%] justify-center text-slate-300">
                    <RiInboxArchiveLine size={200} />
                    <span className="font-sans text-black text-xl">Archived notes appear here.</span>
                </div>
            ) : (
                <NoteLayout filteredNotes={filteredArchiveNotes}
                    sidebaropen={sidebaropen}
                    setSelectedNote={setSelectedNote}
                    view={view}
                />
            )
        }
    </div>
}