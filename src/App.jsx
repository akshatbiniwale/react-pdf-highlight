import { useState } from 'react'
import PdfViewer from './components/PdfViewer'
import AnalysisPanel from './components/AnalysisPanel'
import './App.css'

function App() {
  const [highlightActive, setHighlightActive] = useState(false)
  const [currentTargetPhrase, setCurrentTargetPhrase] = useState('gain on sale of non-current assets')
  const [currentPage, setCurrentPage] = useState(1)

  const handleHighlightToggle = () => {
    setHighlightActive(!highlightActive)
  }

  const handleReferenceClick = (referenceNumber) => {
    // Map references to pages and phrases
    const referenceMappings = {
      1: { page: 3, phrase: 'Maersk\u2019s results continued to improve year-on-year' },
      2: { page: 5, phrase: 'EBITDA increased to USD 2.3bn (USD 2.1bn)' },
      3: { page: 15, phrase: 'Gain on sale of non-current assets' }
    }

    const mapping = referenceMappings[referenceNumber]
    if (mapping) {
      setCurrentPage(mapping.page)
      setCurrentTargetPhrase(mapping.phrase)
      setHighlightActive(true)
    }
  }

  const handlePageNavigate = (pageNumber) => {
    setCurrentPage(pageNumber)
    setHighlightActive(false) // Clear any active highlights when navigating
  }

  return (
    <div className="app">
      <div className="pdf-panel">
        <PdfViewer
          onDocumentLoadSuccess={(data) => {}}
          onDocumentLoadError={(error) => console.error('PDF load error:', error)}
          shouldHighlight={highlightActive}
          targetPhrase={currentTargetPhrase}
          pageNumber={currentPage}
        />
      </div>
      <AnalysisPanel
        onHighlightToggle={handleHighlightToggle}
        highlightActive={highlightActive}
        onReferenceClick={handleReferenceClick}
        onPageNavigate={handlePageNavigate}
      />
    </div>
  )
}

export default App
