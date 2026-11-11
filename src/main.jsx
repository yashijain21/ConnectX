import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import BrandMotion from './components/BrandMotion.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import './styles.css'
import './enhancements.css'
import './who-we-support.css'
import './who-we-support-image.css'
import './partner-standards.css'
import './responsive-motion.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <LoadingScreen />
      <App />
      <BrandMotion />
    </>
  </React.StrictMode>,
)
