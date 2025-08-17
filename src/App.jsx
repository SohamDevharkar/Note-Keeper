import { useState, useEffect } from 'react';
import './App.css'
import { Header } from './components/my-components/Header'
import { SidebarBox } from './components/my-components/Sidebar'
import { NoteView } from './pages/NoteView.jsx';

function App() {
  const [sidebaropen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    const noteList = sessionStorage.getItem('noteList')
    return noteList ? JSON.parse(noteList) : []
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [inputOpen, setInputOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState("notes");



  return (
    <>
      <div className='flex min-h-screen overflow-hidden'>
        <Header sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} view={viewFilter} />

        <div className=''>
          <SidebarBox sidebaropen={sidebaropen} setSidebarOpen={setSidebarOpen} view={viewFilter} setViewFilter={setViewFilter}/>
        </div>

        <div className={`mt-16 w-full max-w-[1480px] flex-col  ${sidebaropen ? 'ml-56' : 'ml-16'} border-4 border-green-500 transition-all duration-300`}>
          <NoteView notes={notes} 
          inputOpen={inputOpen} setInputOpen={setInputOpen} 
          sidebaropen={sidebaropen} setNotes={setNotes} viewFilter={viewFilter} 
          setViewFilter={setViewFilter} />
        </div>
      </div>
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