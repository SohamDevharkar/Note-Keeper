import { useEffect, useState } from "react";
import { TipTapEditor } from "./Tiptap";
import { IoColorPaletteOutline } from "react-icons/io5";
import { BsPin, BsPinFill, BsTrash } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri";
import { MdFormatColorText } from "react-icons/md";
import { Palette } from "lucide-react";
import { Pallete } from "./Pallete";
import { useQueryClient } from "@tanstack/react-query";
import { useNoteUpdateMutation } from "../../hooks/useNoteUpdateMutation";

export const ModalView = ({ selectedNote, setSelectedNote, notes, setNotes, }) => {
    const [title, setTitle] = useState(selectedNote.title)
    const [content, setContent] = useState(selectedNote.content);
    const [showTipTapMenu, setShowTipTapMenu] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [bgColor, setBgColor] = useState(selectedNote.bgColor || 'bg-white');
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

    const queryClient = useQueryClient();
    const userName = sessionStorage.getItem('username')

    const updateNoteMutation = useNoteUpdateMutation(userName, setNotes, queryClient);

    //for testing
    useEffect(() => {
        console.log("Color changed:", bgColor);
    }, [bgColor]);


    function handleSubmit(updatedNote) {
        // const updatedNoteWithBgColor = { ...updatedNote, color: color, pinned: pinned };
        // const updatedNoteList = notes.map((note) => {
        //     if (note.id === updatedNoteWithBgColor.id) {
        //         return updatedNoteWithBgColor;
        //     }
        //     return note;
        // });
        // setNotes(updatedNoteList);
        // setSelectedNote(updatedNoteWithBgColor);
        // sessionStorage.setItem('noteList', JSON.stringify(updatedNoteList));
        // closeModal();

        const updatedNoteWithBgColor = { ...updatedNote, bgColor: bgColor, pinned: pinned };
        
        //for testing:
        console.log("Submitting updated note:", updatedNoteWithBgColor);

        updateNoteMutation.mutate(updatedNoteWithBgColor, {
            onSuccess: () => {
                setSelectedNote(updatedNoteWithBgColor)
                closeModal();
            }
        })

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
            <div className={`relative transition-all duration-300 ${bgColor ? bgColor : 'dark:bg-gray-700'} border-2 border-gray-500 
                min-h-[600px] w-150 rounded-md `}>
                <div className={`max-w-full h-full  border-4 my-2 border-transparent rounded-md`}>
                    <div className="flex items-center">
                        <input placeholder="Title" value={title} className="focus:border-b pb-2 outline-none 
                            focus:border-b-black w-full h-full text-3xl text-black"
                            onChange={(e) => setTitle(e.target.value)} />
                        <span className="p-2 hover:bg-slate-200 text-black rounded-full"
                            onClick={() => setPinned(!pinned)}>
                            {pinned ? <BsPinFill size={22} /> : <BsPin size={22} />}
                        </span>
                    </div>

                    <TipTapEditor
                        value={content}
                        onChange={setContent}
                        showTipTapMenu={showTipTapMenu}
                        className={`w-full min-h-[480px] resize-none focus:outline-none border-none ${bgColor ? 'dark:text-black' : 'dark:text-gray-200' } `}
                    />
                    <div className="flex justify-between">
                        <div className="flex gap-6 mx-4 my-2">
                            {
                                items.map((item) => (
                                    item.title === 'theme' ? (
                                        <div key={item.title} className="relative">
                                            <button title={item.title}
                                                className={` text-gray-600 hover:text-black 
                                                    hover:bg-gray-100 h-8 w-8 rounded-full flex justify-center items-center`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowPalette(s => !s)
                                                }}
                                            >
                                                <item.icon size={20} />
                                            </button>
                                            {
                                                showPalette && <Pallete
                                                    id={selectedNote.id}
                                                    setShowPalette={setShowPalette}
                                                    bgColor={bgColor}           // pass current local color
                                                    setBgColor={setBgColor}

                                                />
                                            }
                                        </div>
                                    ) : (
                                        <button key={item.title}
                                            title={item.title}
                                            className={`text-gray-600 hover:text-black hover:bg-slate-100 
                                                        h-8 w-8 rounded-full flex justify-center items-center  `}
                                            onClick={() => {
                                                console.log(item.view)
                                                item.title === "Format" ? setShowTipTapMenu(!showTipTapMenu) : handleNoteViewChange(selectedNote.id, item.view);
                                            }}>
                                            <item.icon size={20} />
                                        </button>
                                    )
                                ))
                            }
                        </div>
                        <button title="Submit" className="text-sm px-3 mx-10 w-18 py-1 my-1 bg-gray-100 
                                hover:bg-gray-200 dark:text-gray-200  dark:bg-gray-600 dark:hover:bg-green-400 rounded"  onClick={() => {
                                console.log("SelectedNote: " + JSON.stringify(selectedNote))
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