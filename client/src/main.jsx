import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AiTest from './ai-test.jsx'
import Canvas from './canvas.jsx'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/b" element = {<App/>}/>
      <Route path="/b" element = {<AiTest/>}/>
      <Route path="/" element = {<Canvas/>}/>
    </Routes>
  </BrowserRouter>
)
