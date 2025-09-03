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
    notes,
    setNotes,
    view,
    pinned
}) => {

    const [showPalette, setShowPalette] = useState(false);
    const queryClient = useQueryClient();
    const userName = sessionStorage.getItem('username');
    const updateNoteMutation = useNoteUpdateMutation(userName, setNotes, queryClient);


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
        const selectedNote = notes.find(note => note.id === id);
        updateNoteMutation.mutate({ ...selectedNote, pinned: !selectedNote.pinned });
    }

    function handleSafeHtml(json) {
        const htmlContent = DOMPurify.sanitize(generateHTML(json, [StarterKit, TextStyle, FontSize]));
        return htmlContent;
    }

    return (
        <div className={`${view ? 'max-w-screen-lg  my-4 min-h-[100px] w-full' : 'sm:max-w-[250px] sm:px-2'} 
                        w-90 border-3 hover:border-red-500 min-h-[200px] ${bgColor} transition-all duration-300 dark:text-black
                        rounded-md shadow break-inside-avoid whitespace-pre-wrap flex flex-col justify-between`
        }
            onClick={onCardClick}>
            <div className="flex items-center">
                <p className=" px-2 font-semibold font-sans text-xl w-full ">
                    {title}
                </p>
                <span className="p-2 hover:bg-slate-50 rounded-full"
                    onClick={handlePinToggle}>
                    {pinned ? <BsPinFill size={18} /> : <BsPin size={18} />}
                </span>
            </div>

            <p className="flex-10 mx-2" dangerouslySetInnerHTML={{ __html: handleSafeHtml(content) }} />

            <div className=" flex justify-around p-1" onClick={(e) => e.stopPropagation()}>

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
                                    notes={notes}
                                    setNotes={setNotes}
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