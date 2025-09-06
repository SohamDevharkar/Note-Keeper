import { BsTrash } from "react-icons/bs"
import { NoteLayout } from "../components/my-components/NoteLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAndLoad } from "../hooks/useFetchAndLoad";
import { useEffect } from "react";

export const TrashView = ({
    notes,
    setNotes,
    sidebaropen,
    view,
}) => {

    const queryClient = useQueryClient()
    const userName = sessionStorage.getItem('username');
    const { data, isLoading, error, isError } = useFetchAndLoad(queryClient, userName);

    useEffect(() => {
        if (data && data.length > 0) {
            setNotes(data);
        }
    }, [data, setNotes])

    const filteredTrashNotes = notes.filter((note) => note.view === 'trash' && note.sync_status !== "SyncStatus.deleted");

    function isArrayNullOrEmpty(filteredTrashNotes) {
        return notes === null || notes === undefined || (Array.isArray(notes) && notes.length === 0);
    }

    console.log("isArrayNullOrEmpty: " + isArrayNullOrEmpty(filteredTrashNotes));

    if (isLoading) return <div>Loading notes....</div>
    if (isError) return <div>Error Loading notes</div>

    return <div className={`${isArrayNullOrEmpty(filteredTrashNotes) ? 'fixed' : 'relative'} h-full p-2 sm:w-full dark:bg-gray-900`}>
        {
            isArrayNullOrEmpty(filteredTrashNotes) ? (
                <div className=" flex flex-col items-center h-60 my-[12%] mx-[16%] justify-center text-slate-300">
                    <BsTrash size={200} />
                    <span className="font-sans text-black text-xl">Trashed notes appear here.</span>
                </div>
            ) : (
                <NoteLayout filteredNotes={filteredTrashNotes}
                    notes={notes}
                    setNotes={setNotes}
                    sidebaropen={sidebaropen}
                    view={view}
                />
            )
        }
    </div>
}