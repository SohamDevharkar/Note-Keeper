import { Outlet } from "react-router-dom"
import { Header } from "../components/my-components/Header"
import { SidebarBox } from "../components/my-components/Sidebar"
import { ModalView } from "../components/my-components/ModalView"

export const AppLayout = ({
    notes,
    setNotes,
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
    loginState,
    setLoginState,
    isDarkMode,
    setIsDarkMode
}) => {
    return (
        <>
            <div className='flex h-screen overflow-hidden'>
                <Header sidebaropen={sidebaropen}
                    setSidebarOpen={setSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    view={view}
                    setView={setView}
                    loginState={loginState} 
                    setLoginState={setLoginState}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}

                />
                <SidebarBox sidebaropen={sidebaropen} 
                    setSidebarOpen={setSidebarOpen} 
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                />
                <div className={`overflow-auto mt-16 w-full max-w-[1480px] flex-col  ${sidebaropen ? 'ml-56' : 'ml-16'} transition-all duration-300`}>
                    <Outlet/>
                </div>
                {
                    selectedNote &&
                    <ModalView selectedNote={selectedNote}
                        notes={notes} setNotes={setNotes}
                        setSelectedNote={setSelectedNote}
                        showPalette={showPalette}
                        setShowPalette={setShowPalette}
                    />
                }
            </div>
        </>

    )
}