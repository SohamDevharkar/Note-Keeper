import { useState } from "react";
import { FiMenu } from "react-icons/fi"
import { LuSearch } from "react-icons/lu";
import { FaStickyNote } from "react-icons/fa";
import { MdArrowBack, MdOutlineGridView } from "react-icons/md";
import { MdSettings } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Header = ({ sidebaropen, setSidebarOpen, searchQuery, setSearchQuery }) => {

    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const navigate = useNavigate();

    const route = '/search';

    return (
        <header className="flex items-center justify-between h-16 w-full px-4 bg-background border-b gap-6 fixed top-0 left-0 right-0 z-10 shadow-sm">
            {/**Left Section */}
            <div className="flex items-center gap-2 min-w-fit">
                {/** sidebar menu logo div */}

                {!mobileSearchOpen ? (
                    <div onClick={() => setSidebarOpen(!sidebaropen)}
                        className="p-2 rounded-full hover:bg-slate-200 transition">
                        <FiMenu size={28} />
                    </div>
                ) : (
                    <div onClick={() => setMobileSearchOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition md:hidden">
                        <MdArrowBack size={28} />
                    </div>
                )}

                {/* Logo (hidden when mobile search is open on small screens) */}

                <div className={`flex items-center ml-6 text-gray-700 min-w-40  w-full mx-2 
                    ${mobileSearchOpen ? 'hidden md:block' : 'block'}`}>
                    <FaStickyNote size={32} color="orange" />
                    <span className="text-2xl font-light text-gray-600 px-2">Notes</span>
                </div>
            </div>


            {/** Center section*/}
            {/** search bar visible on md+*/}
            {/* <div className={`${mobileSearchOpen ? "flex-grow" : "hidden md:flex"} max-w-2xl mx-6 item-center bg-slate-200
            hover:bg-white focus-within:bg-white border border-transparent focus-within:border-gray-300 rounded-md shadow-sm transition`}
            > */}

            <div className={` ${mobileSearchOpen ? 'flex-grow' : 'hidden md:flex flex-grow md:-translate-x-20'} flex max-w-[600px] items-center
                             bg-slate-100 hover:bg-white focus-within:bg-white border-b
                              focus-within:border-gray-300 rounded-md
                             shadow-sm transition`}                             
            >
                {/* "hidden md:flex flex-grow max-w-2xl mx-6 items-center
    //                         bg-slate-100 hover:bg-white focus-within:bg-white border
    //                         border-transparent focus-within:border-gray-300 rounded-md
    //                         shadow-sm transition"  */}

                <LuSearch size={28} className="ml-4 text-gray-600" />
                <input type="search" placeholder="Search"
                    className="flex-grow px-4 py-2 bg-transparent outline-none text-md"
                    autoFocus={mobileSearchOpen} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    onClick={()=>navigate(route)}
                />
            </div>


            {/**Right section*/}
            <div className={`flex items-center gap-1 justify-between ml-`}>
                {/** Mobile Search Icon (only visible when search is closed) */}
                {!mobileSearchOpen && (
                    <div onClick={() => setMobileSearchOpen(true)}
                        className="p-2 rounded-full hover:bg-slate-200 transition md:hidden">
                        <LuSearch size={28} />
                    </div>
                )}

                {/** View Toggle */}
                <div className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition ">
                    <MdOutlineGridView size={24} />
                </div>

                {/**Setting icon */}
                <div className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition ">
                    <MdSettings size={24} />
                </div>

                {/**Avator Icon */}
                <div className=" rounded-full w-6 h-6  flex items-center justify-center hover:bg-slate-200 transition">
                    <FaUser size={22} />
                </div>
            </div>
        </header>
    )
}


// return <>
    //     <header className="flex items-center h-16 w-full px-4 bg-background border-b gap-6 fixed top-0 left-0 right-0 z-50 shadow-sm">
    //         {console.log("From Header.jsx sidebaropen value: " + sidebaropen)}
    //         {/**menu logo div */}
    //         <div onClick={() =>
    //             setSidebarOpen(!sidebaropen)
    //         }
    //             className={`hover:bg-slate-200 w-9 h-10 m-1 rounded-full
    //                 ${mobileSearchOpen ? 'hidden':''}`}>
    //             <FiMenu size={28} className=" pl-0.5 ml-0.5 mt-1.5" />
    //         </div>

    //         {/** Logo div */}
    //         <div className={`ml-3 font-medium min-w-60 mx-2 block ${mobileSearchOpen ? 'hidden': 'md:block'}`}>
    //             <FaStickyNote size={32} />
    //         </div>

    //         {/**Search bar div 
    //          * className="bg-slate-200 hover:shadow-lg hover:bg-white flex rounded-2xl w-160"
    //          * className="m-3"
    //          * className="placeholder:text-lg 
    //                            placeholder:px-60 
    //                            placeholder:font-sans 
    //                            text-9 
    //                            w-140 
    //                            h-12 
    //                            outline-none"
    //         */}
    //         {/** search bar visible on md+*/}
    //         <div className="hidden md:flex flex-grow max-w-2xl mx-6 items-center
    //                         bg-slate-100 hover:bg-white focus-within:bg-white border
    //                         border-transparent focus-within:border-gray-300 rounded-md
    //                         shadow-sm transition" >
    //             <LuSearch size={22} className="ml-4 text-gray-600" />
    //             <input type="search" placeholder="Search"
    //                 className="flex-grow px-4 py-2 bg-transparent outline-none text-md" />
    //         </div>

    //         {/**Mobile search width */}
    //         <div className={`flex md:hidden items-center flex-grow absolute 
    //             left-0 right-0 px-4 bg-white z-40 transition-all duration-300
    //             ${mobileSearchOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
    //                 <button onClick={() => setMobileSearchOpen(false)}
    //                     className="p-2 rounded-full hover:bg-slate-200 transition">
    //                     <MdArrowBack size={24} />
    //                 </button>
    //                 <div className="flex flex-grow items-center bg-slate-200 focus-within:bg-white 
    //                 border border-transparent focus-within:border-slate-300 rounded-md shadow-sm">
    //                     <LuSearch size={22} className="ml-4 text-gray-600" />
    //                     <input type="search" placeholder="Search"
    //                         className="flex-grow px-3 py-2 bg-transparent outline-none text-sm"
    //                         autoFocus />
    //                 </div> 
    //         </div>

    //         {/**Spacer when mobile search is open */}
    //         <div className={`flex-grow md:hidden ${mobileSearchOpen ? "hidden" : ""}`}></div>

    //         {/** Right side icons */}
    //         <div className={`flex items-center px-2 justify-end mr- ${mobileSearchOpen ? "hidden" :""}`}>
    //             <div className = " rounded-full hover:bg-slate-200 transition md:hidden"
    //                 onClick={()=> setMobileSearchOpen(true)}>
    //                     <LuSearch size={24} />
    //             </div>

    //             {/**view toggle */}
    //             <div className="rounded-full hover:bg-slate-200 transition block">
    //                 <MdOutlineGridView size={24} />
    //             </div>
    //             <div className="rounded-full hover:bg-slate-200 transition block">
    //                 <MdSettings size={24} />
    //             </div>
    //             <div className="w-8 h-8   bg-gray-300 rounded-full">
    //                 A
    //             </div>
    //         </div>
    //     </header>


    // </>
