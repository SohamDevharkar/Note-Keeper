import { RiInboxArchiveLine } from "react-icons/ri";
import { NoteLayout } from "../components/my-components/NoteLayout"

export const ArchiveView = ({
    notes,
    setNotes,
    sidebaropen,
    setSelectedNote,
    view,
    setView
}) => {
    const filteredArchiveNotes = notes.filter((note) => note.view === 'archive');

    function isArrayNullOrEmpty(filteredArchiveNotes) {
        return notes === null || notes === undefined || (Array.isArray(notes) && notes.length === 0);
    }

    console.log("isArrayNullOrEmpty: " + isArrayNullOrEmpty(notes));

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
                    setView={setView}
                />
            )
        }
    </div>
}