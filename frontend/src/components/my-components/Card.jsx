import { BsPin, BsPinFill, BsTrash } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri"
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiInboxUnarchiveLine } from "react-icons/ri";
import { FaTrashRestore } from "react-icons/fa";
import { Pallete } from "./Pallete";
import { useState } from "react";
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { generateHTML } from '@tiptap/react'
import  DOMPurify  from 'dompurify'
import { useNoteUpdateMutation } from "../../hooks/useNoteUpdateMutation";
import { useQueryClient } from "@tanstack/react-query";


export const Card = ({
    id,
    title,
    content,
    bgColor,
    onViewChange,
    onCardClick,
    viewType,
    onDelete,
    view,
    pinned,
    isOnline
}) => {

    const [showPalette, setShowPalette] = useState(false);
    const queryClient = useQueryClient();
    const userName = sessionStorage.getItem('username');
    const updateNoteMutation = useNoteUpdateMutation(userName, queryClient,isOnline);


    let items = [];

    if (viewType === 'archive') {
        items = [
            {
                title: "Unarchive",
                icon: RiInboxUnarchiveLine,
                view: 'notes'
            },
            {

                title: "Trash",
                icon: BsTrash,
                view: 'trash',
            },
            {
                title: "theme",
                icon: IoColorPaletteOutline
            }

        ];
    } else if (viewType === 'trash') {
        items = [
            {
                title: "Restore",
                icon: FaTrashRestore,
                view: 'restore'
            },
            {
                title: "Delete",
                icon: BsTrash,
                view: 'delete'
            }
        ];
    } else {
        items = [
            {
                title: "Archive",
                icon: RiInboxArchiveLine,
                view: 'archive',
                url: "#"
            },
            {
                title: "Trash",
                icon: BsTrash,
                view: 'trash',
                url: "#"
            },
            {
                title: "theme",
                icon: IoColorPaletteOutline

            }
        ]
    }

    function handlePinToggle(e) {
        e.stopPropagation();
        const existingNote = queryClient.getQueryData(['notes', userName])?.find(note => note.client_id === id);
        updateNoteMutation.mutate({ ...existingNote, pinned: !pinned, updated_at: new Date().toISOString(), sync_status: 'pending' });
    }

    function handleSafeHtml(json) {
        const htmlContent = DOMPurify.sanitize(generateHTML(json, [StarterKit, TextStyle, FontSize]));
        return htmlContent;
    }

    return (
        <div className={`group relative ${view ? 'max-w-screen-lg  my-4 min-h-[100px] w-full' : 'sm:max-w-[250px] sm:px-2'} 
                        hover:border-black border w-90 hover:border-3 dark:hover:border-slate-50 min-h-[200px] 
                        ${bgColor !== 'bg-white'? bgColor: 'dark:bg-gray-500 dark:text-slate-300'} transition-all duration-100 dark:text-black rounded-md shadow break-inside-avoid 
                        whitespace-pre-wrap flex flex-col justify-between`
        }
            onClick={onCardClick}>
            <div className="flex items-center">
                <p className=" px-2 font-semibold font-sans text-xl w-full ">
                    {title}
                </p>
                <span className="p-2 hover:bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={handlePinToggle}>
                    {pinned ? <BsPinFill size={18} /> : <BsPin size={18} />}
                </span>
            </div>

            <p className="flex-10 mx-2" dangerouslySetInnerHTML={{ __html: handleSafeHtml(content) }} />

            <div className=" flex justify-around p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
                onClick={(e) => e.stopPropagation()}>

                {items.map((item) => (
                    item.title === 'theme' ? (
                        <div key={item.title} className="relative z-10 mt-2">
                            <button
                                title={item.title}
                                className="text-gray-600 hover:text-black"
                                onClick={e => {
                                    e.stopPropagation();
                                    setShowPalette(s => !s); // Toggle palette
                                }}
                            >
                                <item.icon size={20} />
                            </button>
                            {showPalette && (
                                <Pallete
                                    id={id}
                                    setShowPalette={setShowPalette}
                                />
                            )}
                        </div>
                    ) : (
                        <button
                            key={item.title}
                            title={item.title}
                            className="text-gray-600 hover:text-black z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                item.view === 'delete' ? onDelete(id) : onViewChange(id, item.view);
                            }}
                        >
                            <item.icon size={20} />
                        </button>
                    )
                ))}
            </div>
        </div>
    )
}