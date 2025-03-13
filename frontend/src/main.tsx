import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import Navbar from './components/navbar/Navbar'
import EncounterTable from './components/encounterTable/EncounterTable'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Navbar/>
    <EncounterTable/>
  </StrictMode>
)
