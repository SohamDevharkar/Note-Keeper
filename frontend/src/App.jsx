import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NoteView } from './pages/NoteView.jsx';
import { ArchiveView } from './pages/ArchiveView.jsx';
import { TrashView } from './pages/TrashView.jsx';
import { SearchView } from './pages/SearchView.jsx';
import { AppLayout } from './pages/AppLayout.jsx';
import { SignUpForm } from './pages/SignUpPg.jsx';
import { SignInForm } from './pages/SignInPg.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  const [loginState, setLoginState] = useState(false);
  const [sidebaropen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState(() => {
    const noteList = sessionStorage.getItem('noteList')
    return noteList ? JSON.parse(noteList) : []
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [inputOpen, setInputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [view, setView] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path='/signup' element={
            <SignUpForm />
          } />

          <Route path='/signin' element={
            <SignInForm loginState={loginState} setLoginState={setLoginState} />
          } />
        
          <Route element={<AppLayout 
            notes={notes}
            setNotes={setNotes}
            sidebaropen={sidebaropen}
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            view={view}
            setView={setView}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            showPalette={showPalette}
            setShowPalette={setShowPalette}
            loginState={loginState}
            setLoginState={setLoginState}
          />}>
            <Route path='/home' element={
              <NoteView notes={notes}
                setNotes={setNotes}
                inputOpen={inputOpen}
                setInputOpen={setInputOpen}
                sidebaropen={sidebaropen}
                setSelectedNote={setSelectedNote}
                view={view}
                setView={setView}
                />
              }
            />
            <Route path='/archive' element={
              <ArchiveView notes={notes}
                sidebaropen={sidebaropen}
                setNotes={setNotes}
                setSelectedNote={setSelectedNote}
                view={view}
              />
              } 
            />
            <Route path='/trash' element={
              <TrashView notes={notes}
                inputOpen={inputOpen}
                setInputOpen={setInputOpen}
                sidebaropen={sidebaropen}
                setNotes={setNotes}
                view={view}
              />
              } 
            />
            <Route path='/search' element={
              <SearchView notes={notes}
                sidebaropen={sidebaropen}
                setNotes={setNotes}
                searchQuery={searchQuery}
                setSelectedNote={setSelectedNote}
              />}
            />
          </Route>
        </Routes>
      </Router >
    </QueryClientProvider>
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