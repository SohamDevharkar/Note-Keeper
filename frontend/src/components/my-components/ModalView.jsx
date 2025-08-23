import { useState } from "react";
import { TipTapEditor } from "./Tiptap";
import { IoColorPaletteOutline } from "react-icons/io5";
import { BsPin, BsPinFill, BsTrash } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri";
import { MdFormatColorText } from "react-icons/md";
import { Palette } from "lucide-react";
import { Pallete } from "./Pallete";

// export const ModalView = ({ note, onSave, onClose }) => {

//     const [title, setTitle] = useState(note.title);
//     const [content, setContent] = useState(note.content);
//     const [showTipTapMenu, setTipTapMenu] = useState(false);

//     const handleSave = () => {
//         onSave({...note, title, content})
//     };

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-400 bg-opacity-10 backdrop-blur-sm" onClick={onClose}>
//             <div className="bg-white p-6 rounded-lg 2-[90%] max-w-xl shadow-lg" onClick={(e) => e.stopPropagation()}>
//                 <h2 className="text-2xl mb-4 font-semibold">
//                     Edit Note
//                 </h2>
//                 <input
//                     type="text"
//                     className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                 />
//                 {/* <TipTapEditor
//                     value={content}
//                     onChange={setContent}
//                     showTipTapMenu={showTipTapMenu}
//                     placeholder="Write your note..."
//                     className="w-full border border-gray-300 rounded px-3 py-2 mb-4 min-h-[100px]"
//                 /> */}
//                 <textarea
//                     className="w-full border border-gray-300 rounded px-3 py-2 mb-4 min-h-[100px]"
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                 />
//                 <div className="flex justify-end space-x-2">
//                     <button onClick={onClose} className="px-4 py-2 rounded bg-slate-300 hover:bg-gray-400">
//                         Cancel
//                     </button>
//                     <button onClick={handleSave} className="px-4 py-2 rounded bg-slate-300 hover:bg-green-600">
//                         Save
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }



export const ModalView = ({ selectedNote, setSelectedNote, notes, setNotes, }) => {
    const [title, setTitle] = useState(selectedNote.title)
    const [content, setContent] = useState(selectedNote.content);
    const [showTipTapMenu, setShowTipTapMenu] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [color, setColor] = useState(selectedNote.color || 'bg-white');
    const [pinned, setPinned] = useState(selectedNote.pinned);



    const items = [
        {
            title: "Archive",
            icon: RiInboxArchiveLine,
            view: 'archive',

        },
        {
            title: "Trash",
            icon: BsTrash,
            view: 'trash',

        },
        {
            title: "theme",
            icon: IoColorPaletteOutline
        },
        {
            title: "Format",
            icon: MdFormatColorText
        },

    ]

    const closeModal = () => {
        setSelectedNote(null);
    }

    // function handleSubmit(updatedNote) {
    //     // const notes = sessionStorage.getItem('noteList');
    //     const updatedNoteWithBgColor = {...updatedNote, color: color}
    //     const updatedNoteList = notes.map((note) => {
    //         console.log("updated note id: " + updatedNote.id)

    //         if (note.id === updatedNoteWithBgColor.id) {
    //             console.log("updatedNote: ", { title: updatedNote.title, content: updatedNote.content })

    //             return updatedNoteWithBgColor;
    //         }
    //         return note;
    //     });
    //     setNotes(updatedNoteList);
    //     setSelectedNote(updatedNoteWithBgColor);
    //     sessionStorage.setItem('noteList', JSON.stringify(notes));
    //     closeModal();
    // }

    function handleSubmit(updatedNote) {
        const updatedNoteWithBgColor = { ...updatedNote, color: color, pinned: pinned };
        const updatedNoteList = notes.map((note) => {
            if (note.id === updatedNoteWithBgColor.id) {
                return updatedNoteWithBgColor;
            }
            return note;
        });
        setNotes(updatedNoteList);
        setSelectedNote(updatedNoteWithBgColor);
        sessionStorage.setItem('noteList', JSON.stringify(updatedNoteList));
        closeModal();
    }

    //repeated code from card.jsx except last line
    function handleNoteViewChange(noteId, targetView) {
        const updatedNotes = notes.map((note) => {
            if (noteId === note.id) {
                const newView = note.view === targetView ? 'notes' : targetView;
                return { ...note, view: newView };
            }
            return note;
        });
        console.log("Before updating noteList: " + JSON.stringify(notes));
        setNotes(updatedNotes);
        sessionStorage.setItem('noteList', JSON.stringify(updatedNotes));
        console.log("updated note list: " + JSON.stringify(updatedNotes));
        closeModal();
    }

    return (
        <div className="fixed inset-0 z-50 
                                flex justify-center items-center">
            <div className="bg-black opacity-40 absolute inset-0" />
            <div className={`relative ${color} border-2 border-red-500 min-h-[600px] w-150 rounded-md `}>
                <div className={`max-w-full h-full  border-4 my-2 border-transparent rounded-md`}>
                    <div className="flex items-center">
                        <input placeholder="Title" value={title} className="focus:border-b pb-2  outline-none focus:border-b-black w-full h-full text-3xl"
                            onChange={(e) => setTitle(e.target.value)} />
                        <span className="p-2 hover:bg-slate-200 rounded-full"
                            onClick={() => setPinned(!pinned)}>
                            {pinned ? <BsPinFill size={22} /> : <BsPin size={22} />}
                        </span>
                    </div>

                    <TipTapEditor
                        value={content}
                        onChange={setContent}
                        showTipTapMenu={showTipTapMenu}
                        className={`w-full min-h-[480px]  resize-none focus:outline-none border-none`}
                    />
                    <div className="flex justify-between">
                        <div className="flex gap-6 mx-4 my-2">
                            {/* {items.map((item) => (
                                <button key={item.title}
                                    title={item.title}
                                    className={`text-gray-600 hover:text-black hover:bg-slate-300 h-8 w-8 rounded-full flex justify-center items-center  `}
                                    onClick={() => {console.log(item.view)
                                        item.title === "Format" ? setShowTipTapMenu(!showTipTapMenu) : handleNoteViewChange(selectedNote.id, item.view);
                                    }}>
                                    <item.icon size={20} className="" />
                                </button>
                            ))} */}

                            {
                                items.map((item) => (
                                    item.title === 'theme' ? (
                                        <div key={item.title} className="relative">
                                            <button title={item.title}
                                                className="text-gray-600 hover:text-black hover:bg-slate-300 
                                                    h-8 w-8 rounded-full flex justify-center items-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowPalette(s => !s)
                                                }}
                                            >
                                                <item.icon size={20} />
                                            </button>
                                            {
                                                showPalette && <Pallete
                                                    // id={selectedNote.id}
                                                    // setShowPalette={setShowPalette}
                                                    // notes={notes}
                                                    // setNotes={setNotes}
                                                    // setSelectedNote={setSelectedNote}
                                                    id={selectedNote.id}
                                                    setShowPalette={setShowPalette}
                                                    color={color}           // pass current local color
                                                    setColor={setColor}

                                                />
                                            }
                                        </div>
                                    ) : (
                                        <button key={item.title}
                                            title={item.title}
                                            className={`text-gray-600 hover:text-black hover:bg-slate-300 h-8 w-8 rounded-full flex justify-center items-center  `}
                                            onClick={() => {
                                                console.log(item.view)
                                                item.title === "Format" ? setShowTipTapMenu(!showTipTapMenu) : handleNoteViewChange(selectedNote.id, item.view);
                                            }}>
                                            <item.icon size={20} className="" />
                                        </button>
                                    )
                                ))
                            }
                        </div>
                        <button title="Submit" className="text-sm px-3 mx-10 w-18 py-1 my-1 bg-gray-100 
                                hover:bg-gray-200 rounded"  onClick={() => {
                                console.log("SelectedNote: " + selectedNote)
                                handleSubmit({ ...selectedNote, title, content })
                            }}>
                            Submit
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}