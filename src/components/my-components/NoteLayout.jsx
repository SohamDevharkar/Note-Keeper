import Masonry from 'react-masonry-css'
import {Card } from './Card'

export const NoteLayout = ({notes, setNotes, sidebaropen, view, setViewFilter}) => {

    const onMove = (id, targetView) => {
        setNotes((note) => {
            note.id === id ? {...note, view: targetView} : note
        })
    }

    const filteredNotes = notes.filter((note) => {
        if(view === 'archived') {
            return note.view === 'archived';
        }
        if(view === 'trash') {
            return note.view === 'trash';
        }
        return note.view === 'notes'
        
    })

    console.log("filteredNotes: " + filteredNotes)

    const breakpointColumnsObj = {
        default: sidebaropen ? 5: 6,
        1630: sidebaropen ? 4 : 5,
        1496: sidebaropen ?3 : 4,
        1220: sidebaropen ?2 : 3,
        937: sidebaropen ?1 : 2,
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

    return <div className={`w-full  min-h-[400px] `}>
        <Masonry breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid "
                columnClassName="my-masonry-grid_column ">
            {filteredNotes.reverse().map((note) => {
            console.log('from app.jsx note: ' + note);
            return (<div key={note.id}  >
                        <Card id={note.id} title={note.title} 
                            content={note.content} 
                            bgColor="bg-red-200" 
                            setViewFilter={setViewFilter}
                        />
                    </div>)
                }
            )
        }
        </Masonry>

    </div>
}