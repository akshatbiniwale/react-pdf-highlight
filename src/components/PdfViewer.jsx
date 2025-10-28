import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Document } from 'react-pdf'
import PdfPageWithTextLayer from './PdfPageWithTextLayer'

// Worker is configured globally in src/main.jsx

export default function PdfViewer({
  onDocumentLoadSuccess,
  onDocumentLoadError,
  shouldHighlight = false,
  targetPhrase = 'gain on sale of non-current assets',
  pageNumber: propPageNumber = 1
}) {
  const [numPages, setNumPages] = useState(null)
  const [pdfDocument, setPdfDocument] = useState(null)
  const [pageNumber, setPageNumber] = useState(propPageNumber)

  // Update page number when prop changes
  useEffect(() => {
    setPageNumber(propPageNumber)
  }, [propPageNumber])

  const onDocumentLoadSuccessHandler = useCallback((pdf) => {
    const nextNumPages = pdf?.numPages
    setNumPages(nextNumPages)
    setPdfDocument(pdf)
    if (onDocumentLoadSuccess) {
      onDocumentLoadSuccess({ numPages: nextNumPages })
    }
  }, [onDocumentLoadSuccess])

  const onDocumentLoadErrorHandler = useCallback((error) => {
    console.error('Error loading PDF:', error)
    if (onDocumentLoadError) {
      onDocumentLoadError(error)
    }
  }, [onDocumentLoadError])

  // pdfDocument is set in onDocumentLoadSuccessHandler

  const goToPreviousPage = useCallback(() => {
    setPageNumber(prev => Math.max(1, prev - 1))
  }, [])

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(numPages || 1, prev + 1))
  }, [numPages])

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page)
    }
  }, [numPages])

  return (
    <div className="pdf-viewer">
      {/* Page Navigation */}
      {numPages && (
        <div className="pdf-navigation">
          <button
            className="nav-btn"
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            aria-label="Previous page"
          >
            ‹ Previous
          </button>

          <div className="page-input-container">
            <input
              type="number"
              min="1"
              max={numPages}
              value={pageNumber}
              onChange={(e) => goToPage(Number.parseInt(e.target.value) || 1)}
              className="page-input"
              aria-label="Go to page"
            />
            <span className="page-total">of {numPages}</span>
          </div>

          <button
            className="nav-btn"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </div>
      )}

      <Document
        file={`${import.meta.env.BASE_URL}Maersk_Q2_2025_Interim_Report.pdf`}
        onLoadSuccess={onDocumentLoadSuccessHandler}
        onLoadError={onDocumentLoadErrorHandler}
        onLoadProgress={({ loaded, total }) => console.log(`Loading: ${loaded}/${total}`)}
        loading={<div className="pdf-loading">Loading PDF...</div>}
        error={<div className="pdf-error">Error loading PDF. Please ensure the PDF file is placed in /public/Maersk_Q2_2025_Interim_Report.pdf</div>}
      >
        <PdfPageWithTextLayer
          pdf={pdfDocument}
          pageNumber={pageNumber}
          scale={1.5}
          targetPhrase={targetPhrase}
          shouldHighlight={shouldHighlight}
          onRectsReady={(rects) => console.log('Highlight rectangles calculated:', rects)}
        />
      </Document>
      {numPages && (
        <div className="pdf-info">
          Page {pageNumber} of {numPages}
        </div>
      )}
    </div>
  )
}

PdfViewer.propTypes = {
  onDocumentLoadSuccess: PropTypes.func,
  onDocumentLoadError: PropTypes.func,
  shouldHighlight: PropTypes.bool,
  targetPhrase: PropTypes.string,
  pageNumber: PropTypes.number
}
