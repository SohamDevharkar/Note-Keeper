import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/my-components/Header'
import { SidebarBox } from './components/my-components/Sidebar'
import { NoteView } from './pages/NoteView.jsx';
import { ArchiveView } from './pages/ArchiveView.jsx';
import { TrashView } from './pages/TrashView.jsx';
import { ModalView } from './components/my-components/ModalView.jsx';
import { SearchView } from './pages/SearchView.jsx';
import { TbLayoutList } from "react-icons/tb"; // list view icon

function App() {

  const [sidebaropen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    const noteList = sessionStorage.getItem('noteList')
    return noteList ? JSON.parse(noteList) : []
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [inputOpen, setInputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [view, setView] = useState('block');
  
    return (
    <>
      <Router>
        <div className='flex h-screen overflow-hidden'>
          <Header sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

          <div className=''>
            <SidebarBox sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen}  />
          </div>

          <div className={`overflow-auto mt-16 w-full max-w-[1480px] flex-col  ${sidebaropen ? 'ml-56' : 'ml-16'} border-4 border-green-500 transition-all duration-300`}>
            <Routes>

              <Route path='/home' element={
                <NoteView notes={notes}
                  inputOpen={inputOpen} 
                  setInputOpen={setInputOpen}
                  sidebaropen={sidebaropen} 
                  setNotes={setNotes} 
                  setSelectedNote={setSelectedNote}
                   />
              } />

              <Route path='/archive' element={
                <ArchiveView notes={notes}
                  sidebaropen={sidebaropen} 
                  setNotes={setNotes} 
                  setSelectedNote={setSelectedNote}
                   />
              } />

              <Route path='/trash' element={
                <TrashView notes={notes}
                  inputOpen={inputOpen} 
                  setInputOpen={setInputOpen}
                  sidebaropen={sidebaropen} 
                  setNotes={setNotes} 
                   />
              } />

              <Route path='/search' element={
                <SearchView notes={notes}
                  sidebaropen={sidebaropen} 
                  setNotes={setNotes} 
                  searchQuery={searchQuery}
                  setSelectedNote={setSelectedNote}
                />} 
              />

            </Routes>
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
      </Router>
    </>
  )
}

export default App


{/* <div className={`absolute top-16 left-1/2 transform h-46 bg-red-400 
          -translate-x-1/2 transition-all duration-300  w-full border-4 border-green-500  
           px-4 `}> {/*className={`fixed h-56 border top-16 transition-all duration-300 ${sidebaropen ? 'ml-64' : 'ml-16'} w-full py-6`}*/}
// <NoteInput notes={notes} setNotes={setNotes} />
{/* </div>
          <div className={` relative mt-[249px] border-4 border-purple-600 bg-orange-400 w-full px-2 transition-all duration-300 ${sidebaropen ? 'ml-56' : 'ml-16'}`}>
            <Card title="title" content="sdvoifbaefibjnaeipdfvaksdbiveoankfgpujg[sv0dpvkmwiiwo[;vner0igk;sdnv9ekgdn r0igkvshbrpmvsfjg;sv ergvmkshbsrmvbosbb
            kbmofjvljenbpkllngposbosbmsjmrsobjmdslv=sd[;lvnwspgkgvmesbjsfkpobekoijs;kvnsopfvkmsfibpfkb=s]fkweogivsfpvne0rrgiojhk" bgColor={'bg-yellow-300'} />
          </div> */}