import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Canvas } from '@react-three/fiber'
import App from './App.jsx'
import { Physics } from '@react-three/cannon'
import InterFace from './InterFace.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas>
      <Physics
      broadphase='SAP'
      gravity={[0,-2.6,0]}>
        <App />
      </Physics>
    </Canvas>
    <InterFace />
  </StrictMode>,
)
