import Masonry from 'react-masonry-css'
import { Card } from './Card'

export const NoteLayout = ({
    filteredNotes,
    notes,
    setNotes,
    sidebaropen,
    setSelectedNote,
    view, 
    setView
}) => {



    const openModal = (note) => {
        setSelectedNote(note);
    }

    // Commenting for upgrading the function
    // function handleNoteViewChange(noteId, targetView) {
    //     const updatedNotes = notes.map((note) => {
    //         if (noteId === note.id) {
    //             console.log("current note view: " + note.view);
    //             console.log("target view: " + targetView)
    //             const newView = note.view === targetView ? 'notes' : targetView;
    //             return { ...note, view: newView };
    //         }
    //         return note;
    //     });
    //     console.log("Before updating noteList: " + JSON.stringify(notes));
    //     setNotes(updatedNotes);
    //     sessionStorage.setItem('noteList', JSON.stringify(updatedNotes));
    //     console.log("updated note list: " + JSON.stringify(updatedNotes));
    // }

    function handleViewType() {
        setView((s) => !s)
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

    const breakpointColumnsObj = {
        default: sidebaropen ? 5 : 6,
        1630: sidebaropen ? 4 : 5,
        1496: sidebaropen ? 3 : 4,
        1220: sidebaropen ? 2 : 3,
        937: sidebaropen ? 1 : 2,
        640: 1,
    }

    // return <div className={`grid grid-cols-1 sm:grid-cols-2 
    // md:grid-cols-3 lg:grid-cols-4 ${sidebaropen?'xl:grid-cols-5':
    // 'xl:grid-cols-6'} gap-1 xl:gap-4 sm:p-2 xl:p-4  transition-all duration-300`}>
    //     {filteredNotes.reverse().map((note) => {
    //         console.log('from app.jsx note: ' + note);
    //         return (<div key={note.id} className=''>
    //                     <Card id={note.id} title={note.title} 
    //                         content={note.content} 
    //                         bgColor="bg-red-200" 
    //                         setViewFilter={setViewFilter}
    //                     />
    //                 </div>)
    //             }
    //         )
    //     }
    // </div>

    return (
        <div className={`w-full  min-h-[200px] `}>
            {
                view === true ?
                    (
                        <div className='  flex flex-col justify-center items-center '>
                            <div className='px-4 mx-6 w-full max-w-[700px]'>
                                {
                                    filteredNotes.reverse().map((note) => {
                                        return (
                                            <div key={note.id} >
                                                <Card id={note.id} title={note.title}
                                                    content={note.content}
                                                    bgColor={note.color}
                                                    onViewChange={handleNoteViewChange}
                                                    onCardClick={() => openModal(note)}
                                                    viewType={note.view}
                                                    onDelete={handleDeleteNote}
                                                    notes={notes}
                                                    setNotes={setNotes}
                                                    view={view}
                                                    setView={setView}
                                                />
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    ) : (
                        <Masonry breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid "
                            columnClassName="my-masonry-grid_column ">
                            {
                                filteredNotes.reverse().map((note) => {
                                    return (<div key={note.id} >
                                        <Card id={note.id} title={note.title}
                                            content={note.content}
                                            bgColor={note.color}
                                            onViewChange={handleNoteViewChange}
                                            onCardClick={() => openModal(note)}
                                            viewType={note.view}
                                            onDelete={handleDeleteNote}
                                            notes={notes}
                                            setNotes={setNotes}
                                        />
                                    </div>)
                                })
                            }
                        </Masonry>
                    )

            }
        </div>
    )
}