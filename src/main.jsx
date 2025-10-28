import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf'
import PdfJsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'
import './index.css'
import App from './App.jsx'

// Configure PDF.js to use a module worker instance (robust for Vite + pdfjs-dist v5)
GlobalWorkerOptions.workerPort = new PdfJsWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
