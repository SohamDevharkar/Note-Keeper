import Masonry from "react-masonry-css"
import { Card } from "../components/my-components/Card"
import { LuSearch } from "react-icons/lu"

export const SearchView = ({ notes, sidebaropen, setNotes, searchQuery }) => {

    const filteredNotes = notes.filter((note) => note.view === 'notes' && note.title.toLowerCase().includes(searchQuery.toLowerCase()
        || note.content.toLowerCase().includes(searchQuery)))

    const filteredArchivedNotes = notes.filter((note) => note.view === 'archive' && note.title.toLowerCase().includes(searchQuery.toLowerCase()
        || note.content.toLowerCase().includes(searchQuery)))

    const filteredTrashedNotes = notes.filter((note) => note.view === 'trash' && note.title.toLowerCase().includes(searchQuery.toLowerCase()
        || note.content.toLowerCase().includes(searchQuery)))

    const breakpointColumnsObj = {
        default: sidebaropen ? 5 : 6,
        1630: sidebaropen ? 4 : 5,
        1496: sidebaropen ? 3 : 4,
        1220: sidebaropen ? 2 : 3,
        937: sidebaropen ? 1 : 2,
        640: 1,
    }

    const openModal = (note) => {
        setSelectedNote(note);
    }


    function handleNoteViewChange(noteId, targetView) {
        const updatedNotes = notes.map((note) => {
            if (noteId === note.id) {
                if ((note.view === 'archive' && targetView === 'unarchive' && note.prevView) ||
                    (note.view === 'trash' && targetView === 'restore' && note.prevView)) {
                    return { ...note, view: note.prevView, prevView: undefined };
                }
                return { ...note, prevView: note.view, view: targetView };
            }
            return note;
        });
        setNotes(updatedNotes);
        sessionStorage.setItem('noteList', JSON.stringify(updatedNotes));
    }

    function handleDeleteNote(noteId) {
        const deletedNote = notes.find((note) => noteId === note.id)
        const updatedNotes = notes.filter((note) => note.id !== noteId)
        setNotes(updatedNotes);
        sessionStorage.setItem('noteList', JSON.stringify(updatedNotes));
        console.log("deleted note " + JSON.stringify(deletedNote))
    }

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
                                    <div>
                                        Notes:
                                        <div className={`w-full  min-h-[200px] `}>
                                            <Masonry breakpointCols={breakpointColumnsObj}
                                                className="my-masonry-grid "
                                                columnClassName="my-masonry-grid_column ">
                                                {
                                                    filteredNotes.reverse().map((note) => {
                                                        return (<div key={note.id}  >
                                                            <Card id={note.id} title={note.title}
                                                                content={note.content}
                                                                bgColor="bg-red-200"
                                                                onViewChange={handleNoteViewChange}
                                                                onCardClick={() => openModal(note)}
                                                                viewType={'notes'}
                                                                onDelete={handleDeleteNote}
                                                            />
                                                        </div>)
                                                    })
                                                }
                                            </Masonry>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                        <hr />
                        <div>
                            {
                                (filteredArchivedNotes.length > 0) && (
                                    <div>
                                        Archive :
                                        <div className={`w-full  min-h-[200px] `}>
                                            <Masonry breakpointCols={breakpointColumnsObj}
                                                className="my-masonry-grid "
                                                columnClassName="my-masonry-grid_column ">
                                                {
                                                    filteredArchivedNotes.reverse().map((note) => {
                                                        return (<div key={note.id}  >
                                                            <Card id={note.id} title={note.title}
                                                                content={note.content}
                                                                bgColor="bg-red-200"
                                                                onViewChange={handleNoteViewChange}
                                                                onCardClick={() => openModal(note)}
                                                                viewType={'archive'}
                                                                onDelete={handleDeleteNote}
                                                            />
                                                        </div>)
                                                    })
                                                }
                                            </Masonry>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <hr />
                        <div>
                            {
                                (filteredTrashedNotes.length > 0) && (
                                    <div>
                                        Trash:
                                        <div className={`w-full  min-h-[200px] `}>
                                            <Masonry breakpointCols={breakpointColumnsObj}
                                                className="my-masonry-grid "
                                                columnClassName="my-masonry-grid_column ">
                                                {
                                                    filteredTrashedNotes.reverse().map((note) => {
                                                        return (<div key={note.id}  >
                                                            <Card id={note.id} title={note.title}
                                                                content={note.content}
                                                                bgColor="bg-red-200"
                                                                onViewChange={handleNoteViewChange}
                                                                onCardClick={() => openModal(note)}
                                                                viewType={'trash'}
                                                                onDelete={handleDeleteNote}
                                                            />
                                                        </div>)
                                                    })
                                                }
                                            </Masonry>
                                        </div>
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