import Masonry from 'react-masonry-css'
import { Card } from './Card'
import { useQueryClient } from '@tanstack/react-query';
import { useNoteUpdateMutation } from '../../hooks/useNoteUpdateMutation';
import { useNoteDeleteMutation } from '../../hooks/useNoteDeleteMutation';

export const NoteLayout = ({
    filteredNotes,
    notes,
    setNotes,
    sidebaropen,
    setSelectedNote,
    view,
}) => {
    const queryClient = useQueryClient();
    const userName = sessionStorage.getItem('username')

    const updateNoteMutation = useNoteUpdateMutation(userName, setNotes, queryClient);
    const deleteNoteMutation = useNoteDeleteMutation(userName, setNotes, queryClient);

    const openModal = (note) => {
        setSelectedNote(note);
    }

    function handleNoteViewChange(noteId, targetView) {

        let updatedNote;
        notes.map((note) => {
            if (noteId === note.id) {
                console.log("Before - confirming the current view: ", note.view);
                console.log("Before - confirming the curent preView request: ", note.prevView);
                if ((note.view === 'archive' && targetView === 'notes' && note.prevView) ||
                    (note.view === 'trash' && targetView === 'restore' && note.prevView)) {
                    updatedNote = { ...note, view: note.prevView, prevView: undefined };
                    console.log("After - confirming the current view: ", updatedNote.view);
                    console.log("After - confirming the curent preView request: ", updatedNote.prevView);
                } else {
                    updatedNote = { ...note, prevView: note.view, view: targetView };
                    console.log("After - confirming the current view: ", updatedNote.view);
                    console.log("After - confirming the curent preView request: ", updatedNote.prevView);
                }
            }
            return note;
        });
        updateNoteMutation.mutate(updatedNote);
    }

    function handleDeleteNote(noteId) {
        const deletedNote = notes.find((note) => noteId === note.id)
        deleteNoteMutation.mutate(noteId, {
            onSuccess: ()=> console.log("Deleted Note: ", deletedNote),
            onError: (error) => console.error("Error deleting note ", error)
        });
               
        
        
        console.log("deleted note: " ,deletedNote)
    }

    const breakpointColumnsObj = {
        default: sidebaropen ? 5 : 6,
        1630: sidebaropen ? 4 : 5,
        1496: sidebaropen ? 3 : 4,
        1220: sidebaropen ? 2 : 3,
        937: sidebaropen ? 1 : 2,
        640: 1,
    }

    const { pinnedNotes, otherNotes } = filteredNotes.reduce((acc, note) => (acc[note.pinned ? 'pinnedNotes' : 'otherNotes'].push(note), acc), { pinnedNotes: [], otherNotes: [] })

    return (
        <div className={`w-full  min-h-[200px] dark:bg-gray-900 `}>
            {view === true ?
                (
                    <div className='  flex flex-col justify-center items-center '>
                        <div className='px-4 mx-6 w-full max-w-[700px]'>
                            {
                                pinnedNotes.length > 0 && (
                                    <div>
                                        <div className='font-sans text-lg text-slate-400 dark:text-gray-200 mb-4'>
                                            Pinned:
                                        </div>
                                        {
                                            pinnedNotes.reverse().map((note) => {
                                                return (
                                                    <div key={note.id} >
                                                        <Card id={note.id} title={note.title}
                                                            content={note.content}
                                                            bgColor={note.bgColor}
                                                            onViewChange={handleNoteViewChange}
                                                            onCardClick={() => openModal(note)}
                                                            viewType={note.view}
                                                            onDelete={handleDeleteNote}
                                                            notes={notes}
                                                            setNotes={setNotes}
                                                            view={view}
                                                            pinned={note.pinned}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }

                            {
                                otherNotes.length > 0 && (
                                    <div>
                                        <div className='font-sans text-lg text-slate-400 dark:text-gray-200 mb-4'>
                                            Other:
                                        </div>
                                        {
                                            otherNotes.reverse().map((note) => {
                                                return (
                                                    <div key={note.id} >
                                                        <Card id={note.id} title={note.title}
                                                            content={note.content}
                                                            bgColor={note.bgColor}
                                                            onViewChange={handleNoteViewChange}
                                                            onCardClick={() => openModal(note)}
                                                            viewType={note.view}
                                                            onDelete={handleDeleteNote}
                                                            notes={notes}
                                                            setNotes={setNotes}
                                                            view={view}
                                                            pinned={note.pinned}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ) :
                (
                    <>
                        {
                            pinnedNotes.length > 0 && (
                                <div>
                                    <div className='font-sans text-lg text-slate-400 dark:text-gray-200 px-6 mb-4'>
                                        Pinned:
                                    </div>
                                    <Masonry breakpointCols={breakpointColumnsObj}
                                        className="my-masonry-grid "
                                        columnClassName="my-masonry-grid_column ">
                                        {
                                            pinnedNotes.reverse().map((note) => {
                                                return (
                                                    <div key={note.id} >
                                                        <Card id={note.id} title={note.title}
                                                            content={note.content}
                                                            bgColor={note.bgColor}
                                                            onViewChange={handleNoteViewChange}
                                                            onCardClick={() => openModal(note)}
                                                            viewType={note.view}
                                                            onDelete={handleDeleteNote}
                                                            notes={notes}
                                                            setNotes={setNotes}
                                                            view={view}
                                                            pinned={note.pinned}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Masonry>
                                </div>
                            )
                        }

                        {
                            otherNotes.length > 0 && (
                                <div>
                                    <div className='font-sans text-lg text-slate-400 dark:text-gray-200 px-6 mb-4'>
                                        Other:
                                    </div>
                                    <Masonry breakpointCols={breakpointColumnsObj}
                                        className="my-masonry-grid "
                                        columnClassName="my-masonry-grid_column ">
                                        {
                                            otherNotes.reverse().map((note) => {
                                                return (
                                                    <div key={note.id} >
                                                        <Card id={note.id} title={note.title}
                                                            content={note.content}
                                                            bgColor={note.bgColor}
                                                            onViewChange={handleNoteViewChange}
                                                            onCardClick={() => openModal(note)}
                                                            viewType={note.view}
                                                            onDelete={handleDeleteNote}
                                                            notes={notes}
                                                            setNotes={setNotes}
                                                            view={view}
                                                            pinned={note.pinned}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Masonry>
                                </div>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}