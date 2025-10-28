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
  const [inputValue, setInputValue] = useState(propPageNumber.toString())
  const [isInputValid, setIsInputValid] = useState(true)

  // Update page number and input value when prop changes
  useEffect(() => {
    setPageNumber(propPageNumber)
    setInputValue(propPageNumber.toString())
    setIsInputValid(true)
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

  const validateInput = useCallback((value) => {
    const num = Number.parseInt(value) || 0
    return num >= 1 && num <= (numPages || 1)
  }, [numPages])

  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setInputValue(value)
    setIsInputValid(validateInput(value))
  }, [validateInput])

  const handleInputBlur = useCallback(() => {
    if (isInputValid) {
      const num = Number.parseInt(inputValue) || 1
      goToPage(num)
    } else {
      // Reset to current valid page
      setInputValue(pageNumber.toString())
      setIsInputValid(true)
    }
  }, [isInputValid, inputValue, pageNumber])

  const handleInputKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
  }, [handleInputBlur])

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
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className={`page-input ${isInputValid ? '' : 'invalid'}`}
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
        loading={<div className="pdf-loading">Loading PDF...</div>}
        error={<div className="pdf-error">Error loading PDF. Please ensure the PDF file is placed in /public/Maersk_Q2_2025_Interim_Report.pdf</div>}
      >
        <PdfPageWithTextLayer
          pdf={pdfDocument}
          pageNumber={pageNumber}
          scale={1.5}
          targetPhrase={targetPhrase}
          shouldHighlight={shouldHighlight}
          onRectsReady={(rects) => {}}
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
