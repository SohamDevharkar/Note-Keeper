import { BsTrash } from "react-icons/bs"
import { NoteLayout } from "../components/my-components/NoteLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAndLoad } from "../hooks/useFetchAndLoad";
import { Spinner } from "../components/my-components/Loader";

export const TrashView = ({
    sidebaropen,
    view,
    isOnline
}) => {

    const queryClient = useQueryClient()
    const userName = sessionStorage.getItem('username');
    const { data: noteList = [], isLoading, error, isError } = useFetchAndLoad(queryClient, userName, isOnline);
    const filteredTrashNotes = noteList.filter((note) => note.view === 'trash');

    function isArrayNullOrEmpty(filteredTrashNotes) {
        return filteredTrashNotes === null || filteredTrashNotes === undefined || (Array.isArray(filteredTrashNotes) && filteredTrashNotes.length === 0);
    }

    console.log("isArrayNullOrEmpty: " + isArrayNullOrEmpty(filteredTrashNotes));

    if (isLoading) return <div className="flex flex-col justify-center w-full h-full items-center"><Spinner/></div>
    if (isError){
        console.log("Error Loading: ", error);
        return <div>Error Loading notes</div>
    } 

    return <div className={`${isArrayNullOrEmpty(filteredTrashNotes) ? 'fixed' : 'relative'} h-full p-2 sm:w-full dark:bg-gray-900`}>
        {
            isArrayNullOrEmpty(filteredTrashNotes) ? (
                <div className=" flex flex-col items-center h-60 my-[12%] mx-[16%] justify-center text-slate-300">
                    <BsTrash size={200} />
                    <span className="font-sans text-black text-xl">Trashed notes appear here.</span>
                </div>
            ) : (
                <NoteLayout filteredNotes={filteredTrashNotes}
                    sidebaropen={sidebaropen}
                    view={view}
                    isOnline={isOnline}
                />
            )
        }
    </div>
}