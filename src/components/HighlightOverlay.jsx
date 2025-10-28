import React from 'react'
import PropTypes from 'prop-types'

/**
 * Component to render highlight overlays over PDF text
 * Renders absolutely positioned divs with yellow background
 */
export default function HighlightOverlay({ rects }) {
  if (!rects || rects.length === 0) {
    return null
  }

  return (
    <div className="highlight-overlay">
      {rects.map((rect, index) => (
        <div
          key={index}
          className="highlight-rect"
          style={{
            position: 'absolute',
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            backgroundColor: 'rgba(250, 231, 28, 0.7)', // Yellow with transparency
            borderRadius: '2px',
            pointerEvents: 'none', // Don't block interactions
            zIndex: 10
          }}
          aria-hidden="true" // Screen readers don't need to know about highlight rectangles
        />
      ))}
    </div>
  )
}

HighlightOverlay.propTypes = {
  rects: PropTypes.array
}

/**
 * Alternative component for rendering merged highlight rectangles
 * Useful when multiple text spans should be highlighted as one rectangle
 */
export function MergedHighlightOverlay({ rects }) {
  if (!rects || rects.length === 0) {
    return null
  }

  // Merge overlapping or adjacent rectangles for cleaner appearance
  const mergedRects = mergeRectangles(rects)

  return (
    <div className="highlight-overlay">
      {mergedRects.map((rect, index) => (
        <div
          key={index}
          className="highlight-rect merged"
          style={{
            position: 'absolute',
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            backgroundColor: 'rgba(250, 231, 28, 0.7)',
            borderRadius: '2px',
            pointerEvents: 'none',
            zIndex: 10
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

MergedHighlightOverlay.propTypes = {
  rects: PropTypes.array
}

/**
 * Merge overlapping or adjacent rectangles to create cleaner highlights
 * @param {Array} rects - Array of rectangle objects {x, y, width, height}
 * @returns {Array} Merged rectangles
 */
function mergeRectangles(rects) {
  if (rects.length <= 1) {
    return rects
  }

  const sortedRects = [...rects].sort((a, b) => a.y - b.y || a.x - b.x)
  const merged = []

  for (const rect of sortedRects) {
    let mergedWithExisting = false

    for (let i = 0; i < merged.length; i++) {
      const existing = merged[i]

      // Check if rectangles are on the same line and overlap or are adjacent
      if (Math.abs(rect.y - existing.y) < 5 && // Same line (within 5px tolerance)
          rect.x < existing.x + existing.width + 10 && // Overlap or adjacent (within 10px)
          existing.x < rect.x + rect.width + 10) {

        // Merge the rectangles
        const newX = Math.min(existing.x, rect.x)
        const newY = Math.min(existing.y, rect.y)
        const newWidth = Math.max(existing.x + existing.width, rect.x + rect.width) - newX
        const newHeight = Math.max(existing.y + existing.height, rect.y + rect.height) - newY

        merged[i] = { x: newX, y: newY, width: newWidth, height: newHeight }
        mergedWithExisting = true
        break
      }
    }

    if (!mergedWithExisting) {
      merged.push({ ...rect })
    }
  }

  return merged
}
