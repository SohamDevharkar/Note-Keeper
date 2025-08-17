import { LuNotebook } from "react-icons/lu";
import { RiInboxArchiveLine } from "react-icons/ri";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
export const SidebarBox = ({ sidebaropen}) => {

    // const isDesktop = useMediaQuery('(min-width: 979px)');

    // useEffect(() => {
    //     console.log("isDesktop:" + isDesktop);
    //     if (isDesktop === false) {
    //         setSidebarOpen(false);
    //     } else {
    //         setSidebarOpen(true);
    //     }
    // }, [isDesktop])

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
        //new code
        <div className={`fixed top-16 group border h-screen left-0 
            flex flex-col py-4  transition-all duration-300 
            ease-in-out z-100 shadow-md  bg-white 
            ${sidebaropen ? 'w-56 ' : 'w-16 hover:w-56'}`}>
            {items.map((item) => {
                const route = item.view === 'notes' ? '/home' : `/${item.view}`
                return (
                    <div key={item.title} onClick={()=>{
                        navigate(route)}}
                        className="flex items-center gap-4 px-4 py-3 border-2 
                        hover:bg-slate-200 rounded-xl h-14 relative 
                            transaction-all duration-300">
                        {/* {console.log(item.title)} */}
                        <a href={item.url}>
                            <item.icon size={26} className="text-gray-700" />
                        </a>
                        <span className={`text-gray-800 text-sm transition-all 
                        duration-300 whitespace-nowrap  ${sidebaropen ? 'opacity-100 ml-2 ' :
                                'opacity-0 group-hover:opacity-100 '}`}>
                            {item.title}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}


// <div className={`transition-all  duration-300 ease-in-out overflow-hidden h-screen bg-slate-300 fixed top-0 left-0 md:relative
    // ${ sidebarOpenRef.current ? 'w-72 ' : 'w-12'}`}>
    // <SidebarProvider open={sidebaropen} onOpenChange={setSidebarOpen} style={{
    //     "--sidebar-width": "14rem", // w-56
    //     "--sidebar-width-icon": "4rem" // w-12
    // }}>
    //     <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="sm:w-var[--sidebar-width-icon]">
    //         <Sidebar collapsible="icon" className="transition-all duration-175 fixed left-0 top-0 h-screen border-none bg-white">
    //             <SidebarContent>
    //                 <SidebarGroup>

    //                     <SidebarGroupContent>
    //                         <SidebarMenu>
    //                             {items.map((item) => (
    //                                 <SidebarMenuItem key={item.title} className="mb-1 p-1 -mx-1 group-data-[collapsible=icon]:mb-1 h-12 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:-mx-1 ">

    //                                     <SidebarMenuButton asChild className="hover:bg-slate-200 m-1">
    //                                         <div >
    //                                             <a href={item.url} >
    //                                                 <item.icon size={26} className="-mx-1" />
    //                                             </a>
    //                                             <span className="mx-10 group-data-[collapsible=icon]:hidden">{item.title}</span>
    //                                         </div>

    //                                     </SidebarMenuButton>
    //                                 </SidebarMenuItem>
    //                             ))}
    //                         </SidebarMenu>
    //                     </SidebarGroupContent>
    //                 </SidebarGroup>
    //             </SidebarContent>
    //         </Sidebar>
    //     </div>

    // </SidebarProvider>


    //following code works
    // <div className={`transition-all 
    //                 duration-300 
    //                 ease-in-out 
    //                 overflow-hidden 
    //                 h-screen 
    //                 bg-white 
    //                 fixed 
    //                 top-16 
    //                 left-0 
    //                 lg:relative

    //                 ${sidebaropen ? 'w-64' : 'w-16 hover:w-56'}
    //                 `}> {/**side bar outline div */}

    //     <div> {/** sidebar menu items */}
    //         <div className=" position:sticky group flex flex-col py-4 h-screen border-2">
    //             {items.map((item) => (
    //                 /**Menu Item */
    //                 <div key={item.title} className="flex items-center gap-4 p-4 justify-start hover:bg-slate-300 rounded-2xl h-16 ">
    //                     <a url={item.url}>
    //                         <item.icon size={26}/>
    //                     </a>
    //                     <span className={`text-lg p-6 font-little absolute left-16 ${sidebaropen ? 'opacity-100  pointer-events-auto' : 'opacity-0 group-hover:opacity-100  pointer-events-none'}`}>
    //                         {item.title}
    //                     </span>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // </div>