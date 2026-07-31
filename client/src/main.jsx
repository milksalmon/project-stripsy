import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Lobby from './pages/Lobby.jsx'
import Canvas from './pages/Canvas.jsx'
import Reveal from './pages/Reveal.jsx'
import AiTest from './dev/AiTest.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element = {<Lobby/>}/>
      <Route path="/canvas" element = {<Canvas/>}/>
      <Route path="/reveal" element = {<Reveal/>}/>
      <Route path="/dev/ai-test" element = {<AiTest/>}/>
    </Routes>
  </BrowserRouter>
)
