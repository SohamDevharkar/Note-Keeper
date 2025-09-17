import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NoteView } from './pages/NoteView.jsx';
import { ArchiveView } from './pages/ArchiveView.jsx';
import { TrashView } from './pages/TrashView.jsx';
import { SearchView } from './pages/SearchView.jsx';
import { AppLayout } from './pages/AppLayout.jsx';
import { SignUpForm } from './pages/SignUpPg.jsx';
import { SignInForm } from './pages/SignInPg.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LandingPage } from './pages/LandingPage.jsx';
import { ProtectedRoutes } from './components/my-components/ProtectedRoutes.jsx';
import { useBackendStatus } from './hooks/useBackendStatus.js';
import { processMutationQueue } from './utils/mutationQueue.js';

const queryClient = new QueryClient();

function App() {
  const [loginState, setLoginState] = useState(false);
  const [sidebaropen, setSidebarOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [inputOpen, setInputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPalette, setShowPalette] = useState(false);
  const [view, setView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem('theme') === 'dark';
  });

  const isOnline = useBackendStatus();

  useEffect(() => {
    if(isOnline && sessionStorage.getItem('token')) {
      console.log('Backend reachable, syncing mutation queue...');
      processMutationQueue()
    }
  },[isOnline]) 

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      sessionStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      sessionStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />

          <Route path='/signup' element={
            <SignUpForm />
          } />

          <Route path='/signin' element={
            <SignInForm loginState={loginState} setLoginState={setLoginState}
              isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          } />

          <Route element={<AppLayout
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
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isOnline={isOnline}
          />}>
            <Route path='/home' element={
              <ProtectedRoutes>
                <NoteView 
                  inputOpen={inputOpen}
                  setInputOpen={setInputOpen}
                  sidebaropen={sidebaropen}
                  setSelectedNote={setSelectedNote}
                  view={view}
                  setView={setView}
                  isOnline={isOnline}
                />
              </ProtectedRoutes>
            }
            />
            <Route path='/archive' element={
              <ProtectedRoutes>
                <ArchiveView
                  sidebaropen={sidebaropen}
                  setSelectedNote={setSelectedNote}
                  view={view}
                  isOnline={isOnline}
                />
              </ProtectedRoutes>

            }
            />
            <Route path='/trash' element={
              <ProtectedRoutes>
                <TrashView
                  inputOpen={inputOpen}
                  setInputOpen={setInputOpen}
                  sidebaropen={sidebaropen}
                  view={view}
                  isOnline={isOnline}
                />
              </ProtectedRoutes>
            }
            />
            <Route path='/search' element={
              <ProtectedRoutes>
                <SearchView 
                  sidebaropen={sidebaropen}
                  searchQuery={searchQuery}
                  setSelectedNote={setSelectedNote}
                  isOnline={isOnline}
                />
              </ProtectedRoutes>
            }
            />
          </Route>
        </Routes>
      </Router >
    </QueryClientProvider>
  )
}

export default App
