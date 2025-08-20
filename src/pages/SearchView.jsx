import { LuSearch } from "react-icons/lu"
import { NoteLayout } from "../components/my-components/NoteLayout"

export const SearchView = ({ notes, sidebaropen, setNotes, searchQuery, setSelectedNote }) => {

    const filteredNotes = notes.filter((note) => note.view === 'notes' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || note.content.toLowerCase().includes(searchQuery)))

    const filteredArchivedNotes = notes.filter((note) => note.view === 'archive' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || note.content.toLowerCase().includes(searchQuery)))

    const filteredTrashedNotes = notes.filter((note) => note.view === 'trash' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || note.content.toLowerCase().includes(searchQuery)))

    return (
        <div>
            {
                !searchQuery ? (
                    <div className="flex flex-col justify-center items-center border-4 h-168 text-slate-500">
                        <LuSearch size={100} />
                        <span>Search will appear here</span>
                    </div>
                ) : (
                    <>
                        <div>
                            {
                                (filteredNotes.length > 0) && (
                                    <div >
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600">
                                            Notes:
                                        </div>
                                        <NoteLayout filteredNotes={filteredNotes}
                                            notes={notes}
                                            setNotes={setNotes}
                                            sidebaropen={sidebaropen}
                                            setSelectedNote={setSelectedNote}
                                        />
                                    </div>
                                )
                            }

                        </div>
                        <hr />
                        <div>
                            {
                                (filteredArchivedNotes.length > 0) && (
                                    <div>
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600">
                                            Archives:
                                        </div>
                                        <NoteLayout filteredNotes={filteredArchivedNotes}
                                            notes={notes}
                                            setNotes={setNotes}
                                            sidebaropen={sidebaropen}
                                            setSelectedNote={setSelectedNote}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <hr />
                        <div>
                            {
                                (filteredTrashedNotes.length > 0) && (
                                    <div>
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600">
                                            Trash:
                                        </div>
                                        <NoteLayout filteredNotes={filteredTrashedNotes}
                                            notes={notes}
                                            setNotes={setNotes}
                                            sidebaropen={sidebaropen}
                                            setSelectedNote={setSelectedNote}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }
        </div>
    )
}