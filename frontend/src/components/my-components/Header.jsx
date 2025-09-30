import { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi"
import { LuSearch } from "react-icons/lu";
import { FaStickyNote } from "react-icons/fa";
import { MdArrowBack, MdOutlineGridView } from "react-icons/md";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TbLayoutList } from "react-icons/tb"; 
import { VscSync } from "react-icons/vsc";
import { VscSyncIgnored } from "react-icons/vsc";
import { db } from "../../utils/indexedDB";

export const Header = ({ 
    sidebaropen, 
    setSidebarOpen, 
    searchQuery, 
    setSearchQuery, 
    view, 
    setView,
    isDarkMode,
    setIsDarkMode,
    isOnline
}) => {

    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username') || 'username';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();
    const route = '/search';

    async function handleLogout() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('theme')
        document.documentElement.classList.remove('dark')
        setMenuOpen(false)
        await db.notes.clear()
        // await db.mutationQueue.clear();
        navigate('/signin')
    }

    useEffect(() => {
        
        return () => sessionStorage.removeItem('theme');
    }, [isDarkMode])

    useEffect(() => {
        function handleClickOutSide(event) {
            if(menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        if(menuOpen) {
            document.addEventListener("mousedowm", handleClickOutSide);
        } else {
            document.removeEventListener("mousedown", handleClickOutSide);
        }

        return () => document.removeEventListener("mousedown", handleClickOutSide);

    }, [menuOpen])

    return (
        <header className="flex items-center justify-between h-16 w-full px-4 bg-background dark:bg-gray-900 border-none dark:border-gray-700 
                gap-6 fixed top-0 left-0 right-0 shadow-sm transition-all duration-300 z-50">
            {/**Left Section */}
            <div className="flex items-center gap-2 min-w-fit">
                {/** sidebar menu logo div */}

                {!mobileSearchOpen ? (
                    <div onClick={() => setSidebarOpen(!sidebaropen)}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 dark:text-gray-200 transition-all duration-300">
                        <FiMenu size={28} />
                    </div>
                ) : (
                    <div onClick={() => setMobileSearchOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 not-first:transition md:hidden dark:text-gray-200 transition-all duration-300">
                        <MdArrowBack size={28} className=""/>
                    </div>
                )}

                {/* Logo (hidden when mobile search is open on small screens) */}

                <div className={`flex items-center ml-6 text-gray-700 min-w-40  w-full mx-2 transition-all duration-300
                    ${mobileSearchOpen ? 'hidden md:block' : 'block'}`}>
                    <FaStickyNote size={32} color="orange" />
                    <span className="text-2xl font-light text-gray-600 dark:text-gray-200 px-2 transition-all duration-300">Notes</span>
                </div>
            </div>


            {/** Center section*/}
            {/** search bar visible on md+*/}
            <div className={` ${mobileSearchOpen ? 'flex-grow' : 'hidden md:flex flex-grow md:-translate-x-20'} flex max-w-[600px] items-center
                             bg-slate-100 hover:bg-white dark:bg-gray-700 dark:hover:bg-slate-600 focus-within:bg-white dark:focus-within:bg-gray-600 border-none
                             focus-within:border-gray-300 dark:focus-within:border-gray-700 rounded-2xl transition-all duration-300 shadow-sm`}                             
            >
                <LuSearch size={28} className="ml-2 text-gray-600 dark:text-gray-200" />
                <input type="search" placeholder="Search"
                    className="flex-grow px-2 py-2 bg-transparent outline-none text-md placeholder:text-gray-500 dark:placeholder:text-gray-200  transition-all duration-300"
                    autoFocus={mobileSearchOpen} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    onClick={()=>navigate(route)}
                />
            </div>

            {/**Right section*/}
            <div className={`flex items-center gap-1.5 md:gap-6 justify-between`}>
                {/** Mobile Search Icon (only visible when search is closed) */}
                {!mobileSearchOpen && (
                    <div onClick={() => setMobileSearchOpen(true)}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 dark:text-gray-200 md:hidden transition-all duration-300">
                        <LuSearch size={28} />
                    </div>
                )}

                {/**  Sync indicator*/}
                <div>
                    {isOnline ? <VscSync size={28}/> : <VscSyncIgnored size={28} />}
                </div>

                {/** View Toggle */}
                <div className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-gray-700 dark:text-gray-200 transition-all duration-300"
                    onClick={() => setView(!view)}>
                    {view ? <MdOutlineGridView size={24} /> : <TbLayoutList size={24}/>}
                </div>

                {/**Setting icon */}
                <button className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-gray-700 dark:text-gray-200 transition-all duration-300"
                    onClick={() => setIsDarkMode(d => !d)}>
                    {/* <MdSettings size={24} /> */}
                    {isDarkMode ? <MdOutlineLightMode size={24} /> :  <MdDarkMode size={24} />}
                </button>

                {/**Avator Icon */}
                <div className=" rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-gray-700 dark:text-gray-200 transition-all duration-300"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                >
                    <FaUser size={22} />
                    {
                        menuOpen && (
                            <div ref={menuRef}
                                className="absolute flex flex-col justify-center items-center h-90 right-3 top-16  w-[400px] bg-slate-50 dark:bg-gray-700 rounded shadow-lg p-4 text-sm z-50 border">
                                    <div className="bg-slate-500 rounded-full h-25 w-25 border-4 -translate-y-16">
                                        <FaUser size={60} className="mx-3.75 my-3.5"/>
                                    
                                        <div className=" m-6 font-semibold w-40 -translate-x-14 px-6 text-slate-500 text-lg flex flex-col items-center break-inside-avoid whitespace-pre-wrap 
                                            dark:text-gray-200 transition-all duration-300">
                                            Hello {username.split(" ")[0]}
                                        </div>
                                        <button onClick={()=>handleLogout()}
                                            className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900 dark:text-gray-200 border-4 transition-all duration-300"
                                        >
                                        Log Out
                                    </button>
                                    </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </header>
    )
}
