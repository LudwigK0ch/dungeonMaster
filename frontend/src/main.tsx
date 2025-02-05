import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './navbar/Navbar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar/>
  </StrictMode>,
)
