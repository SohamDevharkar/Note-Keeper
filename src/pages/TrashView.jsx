import { BsTrash } from "react-icons/bs"
import { NoteLayout } from "../components/my-components/NoteLayout";

export const TrashView = ({
    notes,
    setNotes,
    sidebaropen,
    view,
}) => {

    const filteredTrashNotes = notes.filter((note) => note.view === 'trash');

    function isArrayNullOrEmpty(filteredTrashNotes) {
        return notes === null || notes === undefined || (Array.isArray(notes) && notes.length === 0);
    }

    console.log("isArrayNullOrEmpty: " + isArrayNullOrEmpty(filteredTrashNotes));

    return <div className={`${isArrayNullOrEmpty(filteredTrashNotes) ? 'fixed' : 'relative'} border-4  p-2 border-purple-600 sm:w-full`}>
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