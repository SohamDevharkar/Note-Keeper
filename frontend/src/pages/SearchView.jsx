import { LuSearch } from "react-icons/lu"
import { NoteLayout } from "../components/my-components/NoteLayout"
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAndLoad } from "../hooks/useFetchAndLoad";
import { isDev } from "../utils/devLoggerUtil";

export const SearchView = ({ sidebaropen, searchQuery, setSelectedNote, isOnline }) => {

    const queryClient = useQueryClient()
    const userName = sessionStorage.getItem('username');
    const { data: noteList = [], isLoading, error, isError } = useFetchAndLoad(queryClient, userName, isOnline);

    if (isLoading) return <div className="flex flex-col justify-center w-full h-full items-center"><Spinner /></div>
    if (isError) {
        if(isDev()){console.log("Error Loading: ", error);}
        return <div>Error Loading notes</div>
    }

    const filteredNotes = noteList.filter((note) => note.view === 'notes' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || JSON.stringify(note.content).toLowerCase().includes(searchQuery.toLowerCase())))

    const filteredArchivedNotes = noteList.filter((note) => note.view === 'archive' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || JSON.stringify(note.content).toLowerCase().includes(searchQuery.toLowerCase())))

    const filteredTrashedNotes = noteList.filter((note) => note.view === 'trash' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || JSON.stringify(note.content).toLowerCase().includes(searchQuery.toLowerCase())))

    return (
        <div>
            {
                !searchQuery ? (
                    <div className="flex flex-col justify-center items-center h-168 text-slate-500">
                        <LuSearch size={100} />
                        <span>Search will appear here</span>
                    </div>
                ) : (
                    <>
                        <div className="dark:bg-gray-900">
                            {
                                (filteredNotes.length > 0) && (
                                    <div className="dark:bg-gray-900">
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600 dark:bg-gray-900">
                                            Notes:
                                        </div>
                                        <NoteLayout filteredNotes={filteredNotes}
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
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600 dark:bg-gray-900">
                                            Archives:
                                        </div>
                                        <NoteLayout filteredNotes={filteredArchivedNotes}
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
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600 dark:bg-gray-900">
                                            Trash:
                                        </div>
                                        <NoteLayout filteredNotes={filteredTrashedNotes}
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