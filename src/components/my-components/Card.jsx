import { BsTrash } from "react-icons/bs";
import { RiInboxArchiveLine } from "react-icons/ri"
import { IoColorPaletteOutline } from "react-icons/io5";


export const Card = ({ id, title, content, bgColor, onViewChange }) => {

    const items = [
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


    /**
     * {`w-96 border-4 border-blue-500 sm:max-w-[250px] lg:w-70 sm:px-2 sm:mx-2 min-h-[200px] ${bgColor} 
        rounded-md shadow break-inside-avoid whitespace-pre-wrap flex flex-col justify-between p-4`}
     */

    return (
        <div className={`w-90 border-4 hover:border-blue-500 sm:max-w-[250px] md:w-full sm:px-4 min-h-[200px] ${bgColor} 
        rounded-md shadow break-inside-avoid whitespace-pre-wrap flex flex-col justify-between p-4`}>
            <div className="flex-1">
                <p className="font-semibold font-sans text-xl  border-b-2 ">
                    {title}
                </p>
            </div>

            <p className="flex-10">
                {content}
            </p>
            <div className="mt-2 flex justify-around border-t p-1">
                {items.map((item) => (
                    <button key={item.title}
                        title={item.title}
                        className="text-gray-600 hover:text-black"
                        onClick={() => { console.log("note id: " + id + " and card menu view: " + item.view)
                            onViewChange(id, item.view)}}>
                        <item.icon />
                    </button>
                ))}

            </div>
        </div>
    )
}