import { LuSearch } from "react-icons/lu"
import { NoteLayout } from "../components/my-components/NoteLayout"
import { useQueryClient } from "@tanstack/react-query";
import { useFetchAndLoad } from "../hooks/useFetchAndLoad";
import { useEffect } from "react";

export const SearchView = ({ notes, sidebaropen, setNotes, searchQuery, setSelectedNote }) => {

    const queryClient = useQueryClient()
    const userName = sessionStorage.getItem('username');
    const { data, isLoading, error, isError } = useFetchAndLoad(queryClient, userName);

    useEffect(() => {
        if (data && data.length > 0) {
            setNotes(data);
        }
    }, [data, setNotes])

    const filteredNotes = notes.filter((note) => note.view === 'notes' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || JSON.stringify(note.content).toLowerCase().includes(searchQuery.toLowerCase())))

    const filteredArchivedNotes = notes.filter((note) => note.view === 'archive' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
        || JSON.stringify(note.content).toLowerCase().includes(searchQuery.toLowerCase())))

    const filteredTrashedNotes = notes.filter((note) => note.view === 'trash' && (note.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600 dark:bg-gray-900">
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
                                        <div className="px-4 py-2 mb-2 text-xl font-sans text-slate-600 dark:bg-gray-900">
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