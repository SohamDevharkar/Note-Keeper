import { useEffect, useState, useRef } from "react";
import { TipTapEditor } from "./Tiptap";
import { MdFormatColorText } from "react-icons/md";
import { RiInboxArchiveLine } from "react-icons/ri";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useQueryClient } from "@tanstack/react-query";
import { Pallete } from "./Pallete";
import { useCreateNoteMutation } from "../../hooks/useCreateNoteMutation";

export const NoteInput = ({inputOpen, setInputOpen, isOnline }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showTipTapMenu, setShowTipTapMenu] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [bgColor, setBgColor] = useState('bg-white');

    const queryClient = useQueryClient();
    const wrapperRef = useRef(null);
    const titleRef = useRef();
    const userName = sessionStorage.getItem('username');
    const createNoteMutation = useCreateNoteMutation(userName, queryClient)

    useEffect(() => {
        if (inputOpen && titleRef.current) {
            titleRef.current.focus();
        }
    }, [inputOpen])

    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                handleClose();
            }
        }

        if (inputOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } 
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [inputOpen, title, content,])

    function handleClose() {
        if (!title.trim() && !content.trim()) {
            setInputOpen(false);
        } else {
            addNote();
            setTitle("");
            setContent("");
            setInputOpen(false);
        }
    }

    function addNote(targetView = 'notes') {
        const client_id = crypto.randomUUID();
        const newNote = {
            id: client_id,
            client_id: client_id,
            title: title,
            content: content === '' ? {
                type: 'doc',
                content: []
            } : content,
            // view: targetView || 'notes',
            // prevView: targetView === 'archive' ? 'notes' : undefined,
            view: targetView,
            prevView: targetView === 'archive' ? 'notes' : undefined,
            bgColor: bgColor || 'bg-white',
            pinned: false,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            sync_status: isOnline ? 'synced' :  'pending'
        }
        createNoteMutation.mutate(newNote);
    }

    function handleArchiveViewChange(targetView = 'notes') {
        if (!title.trim() && !content.trim()) {
            setInputOpen(false);
        } else {
            addNote(targetView);
            setTitle("");
            setContent("");
            setInputOpen(false);
        }
    }

    return (
        <div ref={wrapperRef}
            className={`relative top-5 transform left-1/2 -translate-x-1/2 w-full max-w-[680px]
                min-w-[300px] px-8 sm:px-18 md:px-20 sm:ml-0 transition-all duration-300 `}>
            {!inputOpen ? (
                //collapsed state
                <div onClick={() => setInputOpen(true)}
                    className="bg-white shadow-md rounded-xl px-4 py-3 dark:bg-gray-700
                    cursor-text border hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-500 dark:text-gray-200">
                        Take a note...
                    </span>
                </div>
            ) : (
                //expanded state
                <div className={`shadow-xl rounded-xl px-4 py-4 transition-all duration-300 z-100 min-h-[150px] ${bgColor === 'bg-white' ? 'dark:bg-gray-700' : bgColor}`}>
                    <input ref={titleRef} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                        className={`w-full text-lg font-medium focus:outline-none mb-4 border-b 
                        dark:text-gray-200   ${bgColor !== 'bg-white' ? 'dark:placeholder:text-black': 'dark:placeholder:text-gray-200'}`} />
                    
                    <div className={`${inputOpen ? 'pt-1 w-full' : 'hidden'} `}>
                        <TipTapEditor
                            value={content}
                            onChange={setContent}
                            showTipTapMenu={showTipTapMenu}
                            placeholder="Write your note..."
                            className={`w-full min-h-[100px] resize-none focus:outline-none dark:text-gray-200`}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <div className={`flex gap-4 text-gray-600 dark:text-gray-200 ${bgColor !== 'bg-white' ? 'text-black': ''}`}>
                                <button title="Formatting" className={`hover:text-black dark:hover:text-gray-200 dark:hover:bg-slate-600 p-2 rounded-full ${bgColor !== 'bg-white' ? 'text-black': ''}`} onClick={
                                    () => setShowTipTapMenu(!showTipTapMenu)}>
                                    <MdFormatColorText size={22}/>
                                </button>
                                <button title="Archive" className={`hover:text-black dark:hover:text-gray-200 dark:hover:bg-slate-600 p-2 rounded-full ${bgColor !== 'bg-white' ? 'text-black': ''}`} onClick={
                                    (e) => {
                                        e.preventDefault();
                                        handleArchiveViewChange('archive');
                                    }
                                }>
                                    <RiInboxArchiveLine size={22} />
                                </button>
                                <button title="Background" className={`hover:text-black dark:hover:text-gray-200 dark:hover:bg-slate-600 p-2 rounded-full ${bgColor !== 'bg-white' ? 'text-black': ''}`} onClick={
                                    (e) => {
                                        e.preventDefault();
                                        setShowPalette(s => !s)
                                    }
                                }>
                                    <IoColorPaletteOutline size={22} />
                                </button>
                            </div>
                            {showPalette && (
                                <Pallete
                                    id={undefined}
                                    setShowPalette={setShowPalette}
                                    setBgColor={setBgColor}
                                    isOnline={isOnline}
                                />
                            )}
                            <button title="Close" className="text-sm px-3 py-1 h-10 w-18 bg-gray-200 dark:bg-gray-600
                                hover:bg-slate-200 dark:hover:bg-green-400 rounded-md"  onClick={() =>{
                                    handleClose(); setBgColor('bg-white')}}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};
