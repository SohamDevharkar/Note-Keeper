import { useEffect, useState, useRef } from "react";
import { TipTapEditor } from "./Tiptap";
import { MdFormatColorText } from "react-icons/md";
import { RiInboxArchiveLine } from "react-icons/ri";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { db } from '../../utils/indexedDB'
import axios from 'axios'
import { Pallete } from "./Pallete";

const createNoteApi = async (noteData) => {
    console.log('hitting backend create note')
    const token = sessionStorage.getItem('token'); console.log('current token: ' + token);
    if (!token) {
        throw new Error("Token not found in session storage");
        
    }
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/v1/notes/sync', 
            {notes: [noteData] }, 
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("newNote.data response: ", response.data)
        return response.data;

    } catch (error) {
        console.error('Error in createNoteApi:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received, request was:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        throw error;  // rethrow for react-query onError as well
    }

}

export const NoteInput = ({inputOpen, setInputOpen }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showTipTapMenu, setShowTipTapMenu] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [bgColor, setBgColor] = useState('bg-white');

    const queryClient = useQueryClient();
    const wrapperRef = useRef(null);
    const titleRef = useRef();
    const userName = sessionStorage.getItem('username');

    const mutation = useMutation({
        mutationFn: createNoteApi,
        onMutate: (newNote) => {
            queryClient.cancelQueries(["notes", userName]);
            const previousNotes = queryClient.getQueryData(["notes", userName]) || [];
            queryClient.setQueryData(["notes", userName], [...previousNotes, newNote]);

            db.notes.put(newNote);
            return { previousNotes };
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["notes", userName], data);
        },

        onError: (context) => {
            if (context?.previousNotes) {
                queryClient.setQueryData(["notes", userName], context.previousNotes);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries(["notes", userName])
        }
    })


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

    function addNote(targetView) {
        const newNote = {
            id: crypto.randomUUID(),
            title: title,
            content: content === '' ? {
                type: 'doc',
                content: []
            } : content,
            view: targetView,
            prevView: targetView === 'archive' ? 'notes' : undefined,
            bgColor: bgColor || 'bg-white',
            pinned: false,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            sync_status: 'pending'
        }
        mutation.mutate(newNote);
        console.log("Mutation succeeded: ", JSON.stringify(newNote));
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
