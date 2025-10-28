import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

/**
 * Get text items from a PDF page
 * @param {PDFPageProxy} page - PDF.js page proxy
 * @returns {Promise<Array>} Array of text items with transform, width, height, etc.
 */
export async function getPageTextItems(page) {
  try {
    const textContent = await page.getTextContent()
    return textContent.items
  } catch (error) {
    console.error('Error getting text content:', error)
    return []
  }
}

/**
 * Get viewport for a page at specified scale
 * @param {PDFPageProxy} page - PDF.js page proxy
 * @param {number} scale - Scale factor
 * @returns {Object} Viewport object
 */
export function getViewportForPage(page, scale = 1.5) {
  return page.getViewport({ scale })
}

/**
 * Compute bounding boxes for text items relative to a container
 * Uses DOM-based approach to get accurate coordinates
 * @param {PDFPageProxy} page - PDF.js page proxy
 * @param {string} targetPhrase - The phrase to find and highlight
 * @param {HTMLElement} containerElement - The container element for coordinate calculation
 * @param {number} scale - Scale factor for viewport
 * @returns {Promise<Array>} Array of bounding box objects {x, y, width, height, str}
 */
export async function computeBoundingBoxes(page, targetPhrase, containerElement, scale = 1.5) {
  try {
    // Compute rects directly from text items using transforms (no DOM text layer)
    const viewport = getViewportForPage(page, scale)
    const textContent = await page.getTextContent()
    const items = textContent.items || []
    const containerRect = containerElement.getBoundingClientRect()
    const canvasEl = containerElement.querySelector('canvas')
    const canvasRect = canvasEl ? canvasEl.getBoundingClientRect() : containerRect
    const offsetX = canvasRect.left - containerRect.left
    const offsetY = canvasRect.top - containerRect.top
    const scaleX = canvasRect.width / viewport.width
    const scaleY = canvasRect.height / viewport.height

    const normalizedTarget = (targetPhrase || '').toLowerCase().trim()
    if (!normalizedTarget) return []

    const matches = []

    for (const item of items) {
      const itemText = (item.str || '').toLowerCase()
      if (!itemText) continue

      // Simple contains match per text item
      if (itemText.includes(normalizedTarget)) {
        const rect = itemToViewportRect(item, viewport)
        // PDF.js viewport has origin at top-left but text transform y is baseline from bottom-left.
        // Convert to top-left by flipping against viewport height and subtracting text height.
        const yFromTop = (viewport.height - rect.y) - rect.height
        matches.push({
          x: offsetX + rect.x * scaleX,
          y: offsetY + yFromTop * scaleY,
          width: rect.width * scaleX,
          height: rect.height * scaleY,
          str: item.str
        })
      }
    }

    return matches
  } catch (error) {
    console.error('Error computing bounding boxes:', error)
    return []
  }
}

/**
 * Find text spans that match a target phrase using more sophisticated matching
 * This handles cases where the phrase spans multiple PDF text items
 * @param {Array} textItems - Text items from PDF.js
 * @param {string} targetPhrase - The phrase to find
 * @returns {Array} Array of matched text segments with their indices
 */
export function findMatchingTextSpans(textItems, targetPhrase) {
  const normalizedTarget = targetPhrase.toLowerCase().trim()
  const matches = []

  // Join all text items to create searchable content
  const fullText = textItems.map(item => item.str).join('')
  const normalizedFullText = fullText.toLowerCase()

  // Find all occurrences of the target phrase
  let searchIndex = 0
  let matchIndex = normalizedFullText.indexOf(normalizedTarget, searchIndex)

  while (matchIndex !== -1) {
    // Find which text items correspond to this match
    const matchEndIndex = matchIndex + normalizedTarget.length
    const matchedItems = []
    let currentIndex = 0

    for (let i = 0; i < textItems.length; i++) {
      const item = textItems[i]
      const itemStartIndex = currentIndex
      const itemEndIndex = currentIndex + item.str.length

      // Check if this item overlaps with our match
      if (itemStartIndex < matchEndIndex && itemEndIndex > matchIndex) {
        const itemOverlapStart = Math.max(matchIndex, itemStartIndex)
        const itemOverlapEnd = Math.min(matchEndIndex, itemEndIndex)

        matchedItems.push({
          itemIndex: i,
          text: item.str,
          overlapStart: itemOverlapStart - itemStartIndex,
          overlapLength: itemOverlapEnd - itemOverlapStart
        })
      }

      currentIndex = itemEndIndex
    }

    if (matchedItems.length > 0) {
      matches.push({
        startIndex: matchIndex,
        endIndex: matchEndIndex,
        matchedItems
      })
    }

    searchIndex = matchIndex + 1
    matchIndex = normalizedFullText.indexOf(normalizedTarget, searchIndex)
  }

  return matches
}

/**
 * Convert PDF text item coordinates to viewport coordinates
 * @param {Object} item - PDF text item
 * @param {Object} viewport - PDF viewport
 * @returns {Object} Rectangle in viewport coordinates
 */
export function itemToViewportRect(item, viewport) {
  // Transform item matrix into viewport space
  const m = pdfjsLib.Util.transform(viewport.transform, item.transform)
  // Width/height are derived from the transformed basis vectors
  const width = Math.hypot(m[0], m[2])
  const height = Math.hypot(m[1], m[3])
  // m[4], m[5] is the baseline point. Convert to top-left by subtracting height.
  const x = m[4]
  const y = m[5]
  return { x, y, width, height }
}
