import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Lobby from './pages/Lobby.jsx'
import Canvas from './pages/Canvas.jsx'
import Reveal from './pages/Reveal.jsx'
import JoinRoom from './pages/JoinRoom.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import History from './pages/History.jsx'
import { RoomProvider } from './context/RoomProvider.jsx'
import { SessionProvider } from './context/SessionProvider.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <RoomProvider>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<JoinRoom/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/lobby" element = {<Lobby/>}/>
            <Route path="/canvas" element = {<Canvas/>}/>
            <Route path="/reveal" element = {<Reveal/>}/>
            <Route path='/history' element = {<History/>}/>
          </Routes>
        </SessionProvider>
      </RoomProvider>
    </AuthProvider>
  </BrowserRouter>
)
