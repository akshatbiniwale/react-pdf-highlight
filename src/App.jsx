import { useState } from 'react'
import PdfViewer from './components/PdfViewer'
import AnalysisPanel from './components/AnalysisPanel'
import './App.css'

function App() {
  const [highlightActive, setHighlightActive] = useState(false)
  const [currentTargetPhrase, setCurrentTargetPhrase] = useState('gain on sale of non-current assets')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeNumber, setActiveNumber] = useState(null)

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
      setActiveNumber(null)
    }
  }

  const handleNumberClick = (number) => {
    // Map numbers to their corresponding text phrases in the PDF
    const numberMappings = {
      '25 m': '25',
      '208 m': '208',
      '2.3 bn': '2.3',
      '2.1 bn': '2.1',
      '36 m': '36',
      '71 m': '71',
      '50 m': '50',
      '25': '25',
      '208': '208',
      '2,298': '2,298'
    }

    const targetPhrase = numberMappings[number] || number
    setCurrentTargetPhrase(targetPhrase)
    setHighlightActive(true)
    setActiveNumber(number)
  }

  const handlePageNavigate = (pageNumber) => {
    setCurrentPage(pageNumber)
    setHighlightActive(false) // Clear any active highlights when navigating
    setActiveNumber(null)
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
        onNumberClick={handleNumberClick}
        onReferenceClick={handleReferenceClick}
        onPageNavigate={handlePageNavigate}
        activeNumber={activeNumber}
      />
    </div>
  )
}

export default App
