import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Lobby from './pages/Lobby.jsx'
import Canvas from './pages/Canvas.jsx'
import Reveal from './pages/Reveal.jsx'
import AiTest from './dev/AiTest.jsx'
import JoinRoom from './pages/JoinRoom.jsx'
import { RoomProvider } from './context/RoomProvider.jsx'
import { SessionProvider } from './context/SessionProvider.jsx'

createRoot(document.getElementById('root')).render(
  <RoomProvider>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JoinRoom/>}/>
          <Route path="/lobby" element = {<Lobby/>}/>
          <Route path="/canvas" element = {<Canvas/>}/>
          <Route path="/reveal" element = {<Reveal/>}/>
          <Route path="/dev/ai-test" element = {<AiTest/>}/>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </RoomProvider>
)
