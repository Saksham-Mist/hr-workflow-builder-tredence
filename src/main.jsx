import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Global reset
const style = document.createElement('style')
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #090d14; color: #e5e7eb; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #374151; border-radius: 3px; }
  .react-flow__node { cursor: pointer; }
  .react-flow__controls button { background: #111827 !important; color: #9ca3af !important; border-color: #1f2937 !important; }
  .react-flow__controls button:hover { background: #1f2937 !important; }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
