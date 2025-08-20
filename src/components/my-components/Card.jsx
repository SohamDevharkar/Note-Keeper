import { BsTrash } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri"
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiInboxUnarchiveLine } from "react-icons/ri";
import { FaTrashRestore } from "react-icons/fa";
import { Pallete } from "./Pallete";
import { useState } from "react";


export const Card = ({ id, title, content, bgColor ,onViewChange, onCardClick, viewType, onDelete, notes, setNotes }) => {/**onCardClick */
    
    const [showPalette, setShowPalette] = useState(false);

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




    /**
     * {`w-96 border-4 border-blue-500 sm:max-w-[250px] lg:w-70 sm:px-2 sm:mx-2 min-h-[200px] ${bgColor} 
        rounded-md shadow break-inside-avoid whitespace-pre-wrap flex flex-col justify-between p-4`}
     */

    return (
        <div className={`w-90 border-2 hover:border-blue-500 sm:max-w-[250px] md:w-full sm:px-2 min-h-[200px] ${bgColor} 
        rounded-md shadow break-inside-avoid whitespace-pre-wrap flex flex-col justify-between `}
            onClick={onCardClick}>
            <div className="flex-1">
                <p className="font-semibold font-sans text-xl  border-b-2 ">
                    {title}
                </p>
            </div>

            <p className="flex-10">
                {content}
            </p>
            <div className=" flex justify-around border-t p-1" onClick={(e) => e.stopPropagation()}>
                {/* {items.map((item) => (
                    <button key={item.title}
                        title={item.title}
                        className="text-gray-600 hover:text-black"
                        onClick={item.view === 'delete' ? () => {onDelete(id)} : () => { onViewChange(id, item.view)}}>
                        <item.icon size={20} />
                    </button>
                ))} */}

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
                                <item.icon size={20}  />
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
                                item.view === 'delete'? onDelete(id) : onViewChange(id, item.view);
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