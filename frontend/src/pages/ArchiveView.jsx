import { RiInboxArchiveLine } from "react-icons/ri";
import { NoteLayout } from "../components/my-components/NoteLayout"
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from '../utils/indexedDB'
import { useFetchAndLoad } from "../hooks/useFetchAndLoad";

export const ArchiveView = ({
    notes,
    setNotes,
    sidebaropen,
    setSelectedNote,
    view,
}) => {

    const queryClient = useQueryClient()
    const userName = sessionStorage.getItem('username');
    const {data, isLoading, error, isError} = useFetchAndLoad(queryClient, userName);

    useEffect(()=>{
        if(data && data.length > 0) {
            setNotes(data);
        }
    }, [data, setNotes])

    const filteredArchiveNotes = notes.filter((note) => note.view === 'archive');
    console.log(`archived view for ${userName}: ` + JSON.stringify(filteredArchiveNotes));

    function isArrayNullOrEmpty(filteredArchiveNotes) {
        return notes === null || notes === undefined || (Array.isArray(notes) && notes.length === 0);
    }

    console.log("isArrayNullOrEmpty: " + isArrayNullOrEmpty(notes));

    if(isLoading) return <div>Loading archived notes...</div>
    if(isError) return <div>Error Loading archived notes...</div>

    return <div className={`${isArrayNullOrEmpty(notes) ? 'fixed' : ''} border-4  p-2 border-purple-600  sm:w-full`}>
        {
            isArrayNullOrEmpty(notes) ? (
                <div className="sticky flex flex-col items-center h-60 my-[12%] mx-[16%] justify-center text-slate-300">
                    <RiInboxArchiveLine size={200} />
                    <span className="font-sans text-black text-xl">Archived notes appear here.</span>
                </div>
            ) : (
                <NoteLayout filteredNotes={filteredArchiveNotes}
                    notes={notes}
                    setNotes={setNotes}
                    sidebaropen={sidebaropen}
                    setSelectedNote={setSelectedNote}
                    view={view}
                />
            )
        }
    </div>
}