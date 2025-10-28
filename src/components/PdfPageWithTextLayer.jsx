import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Page } from 'react-pdf'
import HighlightOverlay from './HighlightOverlay'
import { computeBoundingBoxes } from '../utils/pdfTextUtils'

/**
 * PDF page component with text layer and highlight overlay
 * Combines PDF rendering, text extraction, and highlighting
 */
export default function PdfPageWithTextLayer({
  pdf,
  pageNumber,
  scale = 1.5,
  targetPhrase = 'gain on sale of non-current assets',
  shouldHighlight = false,
  onRectsReady
}) {
  const pageContainerRef = useRef()
  const textLayerRef = useRef()
  const [pageProxy, setPageProxy] = useState(null)
  const [highlightRects, setHighlightRects] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Load page and set up text layer
  useEffect(() => {
    let isMounted = true

    const loadPage = async () => {
      if (!pdf) return

      try {
        const page = await pdf.getPage(pageNumber)
        if (!isMounted) return

        setPageProxy(page)

        // If highlighting is enabled, extract text and compute bounding boxes
        if (shouldHighlight && targetPhrase) {
          console.log('Computing bounding boxes for:', targetPhrase, 'on page:', pageNumber)
          setIsProcessing(true)
          const rects = await computeBoundingBoxes(
            page,
            targetPhrase,
            pageContainerRef.current,
            scale
          )
          console.log('Found rects:', rects)
          if (isMounted) {
            setHighlightRects(rects)
            setIsProcessing(false)
            if (onRectsReady) {
              onRectsReady(rects)
            }
          }
        } else {
          console.log('Highlighting disabled or no target phrase')
          setHighlightRects([])
        }
      } catch (error) {
        console.error('Error loading page:', error)
        if (isMounted) {
          setIsProcessing(false)
        }
      }
    }

    loadPage()

    return () => {
      isMounted = false
    }
  }, [pdf, pageNumber, scale, shouldHighlight, targetPhrase, onRectsReady])

  // Update highlights when shouldHighlight changes
  useEffect(() => {
    if (!pageProxy || !shouldHighlight || !targetPhrase) {
      setHighlightRects([])
      return
    }

    const updateHighlights = async () => {
      setIsProcessing(true)
      try {
        const rects = await computeBoundingBoxes(
          pageProxy,
          targetPhrase,
          pageContainerRef.current,
          scale
        )
        setHighlightRects(rects)
        if (onRectsReady) {
          onRectsReady(rects)
        }
      } catch (error) {
        console.error('Error updating highlights:', error)
        setHighlightRects([])
      } finally {
        setIsProcessing(false)
      }
    }

    updateHighlights()
  }, [shouldHighlight, targetPhrase, pageProxy, scale, onRectsReady])

  // Handle resize and scroll events to recompute highlight positions
  useEffect(() => {
    if (!pageProxy || !shouldHighlight || !targetPhrase) return

    let resizeTimeout
    let animationFrame

    const recomputeHighlights = () => {
      if (animationFrame) return // Prevent multiple calls

      animationFrame = requestAnimationFrame(async () => {
        try {
          const rects = await computeBoundingBoxes(
            pageProxy,
            targetPhrase,
            pageContainerRef.current,
            scale
          )
          setHighlightRects(rects)
          if (onRectsReady) {
            onRectsReady(rects)
          }
        } catch (error) {
          console.error('Error recomputing highlights:', error)
        } finally {
          animationFrame = null
        }
      })
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(recomputeHighlights, 100) // Debounce resize events
    }

    const handleScroll = () => {
      recomputeHighlights()
    }

    // Use ResizeObserver for better resize detection
    const resizeObserver = new ResizeObserver(handleResize)
    if (pageContainerRef.current) {
      resizeObserver.observe(pageContainerRef.current)
    }

    // Listen for scroll events on the container
    const container = pageContainerRef.current?.parentElement
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }

    return () => {
      clearTimeout(resizeTimeout)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      resizeObserver.disconnect()
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [pageProxy, shouldHighlight, targetPhrase, scale, onRectsReady])

  return (
    <div
      ref={pageContainerRef}
      className="pdf-page-container"
      style={{ position: 'relative' }}
    >
      {/* PDF Page Canvas */}
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer={false} // We manage our own text layer
        renderAnnotationLayer={false}
        loading={
          <div className="page-loading">
            Loading page {pageNumber}...
          </div>
        }
      />

      {/* Text Layer Container (invisible, used for coordinate calculation) */}
      <div
        ref={textLayerRef}
        className="textLayer"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          visibility: 'hidden' // Hide the text layer as we only use it for coordinates
        }}
      />

      {/* Highlight Overlay */}
      {shouldHighlight && !isProcessing && highlightRects.length > 0 && (
        <HighlightOverlay rects={highlightRects} />
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="highlight-processing">
          Finding highlights...
        </div>
      )}
    </div>
  )
}

PdfPageWithTextLayer.propTypes = {
  pdf: PropTypes.object,
  pageNumber: PropTypes.number.isRequired,
  scale: PropTypes.number,
  targetPhrase: PropTypes.string,
  shouldHighlight: PropTypes.bool,
  onRectsReady: PropTypes.func
}
