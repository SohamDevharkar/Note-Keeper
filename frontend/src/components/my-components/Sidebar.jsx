import { LuNotebook } from "react-icons/lu";
import { RiInboxArchiveLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
export const SidebarBox = ({ sidebaropen}) => {

    const items = [
        {
            title: "Notes",
            icon: LuNotebook,
            view:'notes',
            
        },
        {
            title: "Archive",
            icon: RiInboxArchiveLine,
            view:'archive',
            
        },
        {
            title: "Trash",
            icon: BsTrash,
            view: 'trash',
            
        },
        
    ]

    const navigate = useNavigate();   

    return (
        <div className={`fixed top-16 group h-screen left-0 
            flex flex-col py-4  transition-all duration-300  border-slate-200
            ease-in-out z-50 sm:z-10 hover:shadow-lg  bg-white dark:bg-gray-900
            ${sidebaropen ? 'w-56 border-r' : 'w-18 hover:w-56'}`}>
            {items.map((item) => {
                const route = item.view === 'notes' ? '/home' : `/${item.view}`
                return (
                    <div key={item.title} onClick={()=>{
                        navigate(route)}}
                        className="flex items-center gap-4 px-5 py-3 dark:hover:bg-slate-600
                        hover:bg-slate-200 rounded-2xl h-14 relative 
                            transaction-all duration-300">
                        {/* {console.log(item.title)} */}
                        <a href={item.url}>
                            <item.icon size={26} className="text-gray-700 dark:text-gray-200" />
                        </a>
                        <span className={`text-gray-800 text-sm transition-all duration-300 dark:text-gray-200
                        whitespace-nowrap  ${sidebaropen ? 'opacity-100 ml-2 ' :
                                'opacity-0 group-hover:opacity-100 '}`}>
                            {item.title}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}
