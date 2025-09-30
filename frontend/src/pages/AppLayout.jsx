import { Outlet } from "react-router-dom"
import { Header } from "../components/my-components/Header"
import { SidebarBox } from "../components/my-components/Sidebar"
import { ModalView } from "../components/my-components/ModalView"
import { useEffect } from "react"
import { processMutationQueue } from "../utils/mutationQueue"
import { isDev } from "../utils/devLoggerUtil"

export const AppLayout = ({
    sidebaropen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    view,
    setView,
    selectedNote,
    setSelectedNote,
    showPalette,
    setShowPalette,
    isDarkMode,
    setIsDarkMode,
    isOnline
}) => {

    useEffect(() => {
        if (isOnline && sessionStorage.getItem('token')) {
            if(isDev()){console.log('Backend reachable, syncing mutation queue...');}
            processMutationQueue()
        } else {
            alert('You are working in offline mode!!')
        }
    }, [isOnline])


    return (
        <>
            <div className='flex h-screen overflow-hidden'>
                <Header sidebaropen={sidebaropen}
                    setSidebarOpen={setSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    view={view}
                    setView={setView}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    isOnline={isOnline}

                />
                <SidebarBox sidebaropen={sidebaropen}/>
                
                <div className={`overflow-auto mt-16 w-full max-w-[1480px] flex-col  ${sidebaropen ? 'ml-56' : 'ml-16'} 
                    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white dark:scrollbar-thumb-gray-600 
                    dark:scrollbar-track-gray-900 transition-all duration-300`}>
                    <Outlet />
                </div>
                {
                    selectedNote &&
                    <ModalView selectedNote={selectedNote}
                        setSelectedNote={setSelectedNote}
                        showPalette={showPalette}
                        setShowPalette={setShowPalette}
                        isOnline={isOnline}
                    />
                }
            </div>
        </>

    )
}