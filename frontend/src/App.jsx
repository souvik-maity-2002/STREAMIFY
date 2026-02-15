import { Toaster, toast } from 'react-hot-toast'
import { Route, Routes ,Navigate} from 'react-router-dom'

import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import PageLoader from './components/PageLoader.jsx'
import useAuthUser from './hooks/useAuthUser.js'

const App = () => {

  //tanstack query
  const {isLoading, authUser}=useAuthUser()

  const isAuthenticated=Boolean(authUser)
  const isOnBoarded=Boolean(authUser?.isOnboarded)

  
  if(isLoading) return <PageLoader/>
  

  return (
    <div data-theme="sunset" className="p-10">
      <button onClick={()=> toast.success("hello world")}>Create a toast</button>
      <Routes>
        <Route path="/" element={ isAuthenticated && isOnBoarded ? (
          <HomePage />
        ):(
          <Navigate to ={isAuthenticated ? "/onboarding" : "/login"} />
        )} />
        <Route path="/signup" element={ !isAuthenticated ? <SignUpPage />  : <Navigate to ="/"/>} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage />  : <Navigate to ="/"/>} />
        <Route path="/notification" element={isAuthenticated ? <NotificationPage /> : <Navigate to ="/login"/>} />
        <Route path="/call" element={isAuthenticated ? <CallPage /> : <Navigate to ="/login"/>} />
        <Route path="/chat" element={isAuthenticated ? <ChatPage /> : <Navigate to ="/login"/>} />
        <Route path="/onboarding" element={isAuthenticated ? <OnBoardingPage /> : <Navigate to ="/login"/>} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
