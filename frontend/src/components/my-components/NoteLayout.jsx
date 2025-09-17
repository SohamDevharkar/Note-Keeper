import Masonry from 'react-masonry-css'
import { Card } from './Card'
import { useQueryClient } from '@tanstack/react-query';
import { useNoteUpdateMutation } from '../../hooks/useNoteUpdateMutation';
import { useNoteDeleteMutation } from '../../hooks/useNoteDeleteMutation';

export const NoteLayout = ({
    filteredNotes,
    sidebaropen,
    setSelectedNote,
    view,
    isOnline
}) => {
    const queryClient = useQueryClient();
    const userName = sessionStorage.getItem('username')

    const updateNoteMutation = useNoteUpdateMutation(userName, queryClient, isOnline);
    const deleteNoteMutation = useNoteDeleteMutation(userName, queryClient, isOnline);

    const openModal = (note) => {
        setSelectedNote(note);
    }

    function handleNoteViewChange(noteId, targetView) {
        const currentNote = filteredNotes.find(note => note.client_id === noteId );
        let updatedNote;
        if ((currentNote.view === 'archive' && targetView === 'notes' && currentNote.prevView) ||
                (currentNote.view === 'trash' && targetView === 'restore' && currentNote.prevView)) {
                    updatedNote ={
                        ...currentNote,
                        view: currentNote.prevView, 
                        prevView: undefined, 
                        updated_at: new Date().toISOString(), 
                    };
        } else {
            updatedNote ={
                        ...currentNote,
                        prevView: currentNote.view, 
                        view: targetView, 
                        updated_at: new Date().toISOString(), 
            };
        }
        updateNoteMutation.mutate(updatedNote);
    }

    function handleDeleteNote(noteId) {
        const deletedNote = filteredNotes.find((note) => noteId === note.client_id)
        deleteNoteMutation.mutate(deletedNote);
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

    const renderCards = (notesList) =>
        [...notesList].map((note) => (
            <div key={note.client_id}>
                <Card
                    id={note.client_id}
                    title={note.title}
                    content={note.content}
                    bgColor={note.bgColor}
                    onViewChange={handleNoteViewChange}
                    onCardClick={() => openModal(note)}
                    viewType={note.view}
                    onDelete={handleDeleteNote}
                    view={view}
                    pinned={note.pinned}
                    isOnline={isOnline}
                />
            </div>
        ))

    return (
        <div className='flex flex-col flex-grow h-full overflow-hidden'> 
            <div className={`w-full flex-grow dark:bg-gray-900 `}>
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
                                                renderCards(pinnedNotes)
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
                                                renderCards(otherNotes)
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
                                                renderCards(pinnedNotes)
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
                                                renderCards(otherNotes)
                                            }
                                        </Masonry>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
}