import React from 'react'
import PropTypes from 'prop-types'

// Helper component for number buttons
const NumberButton = ({ value, displayText, activeNumber, onNumberClick, onKeyDown }) => (
  <button
    className={`number-link ${activeNumber === value ? 'active' : ''}`}
    onClick={() => onNumberClick(value)}
    onKeyDown={(e) => onKeyDown(e, value)}
    aria-label={`Highlight ${value} in PDF`}
    tabIndex={0}
  >
    {displayText}
  </button>
)

NumberButton.propTypes = {
  value: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  activeNumber: PropTypes.string,
  onNumberClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired
}

// Helper component for reference buttons
const ReferenceButton = ({ referenceNumber, highlightActive, onReferenceClick, onKeyDown, label }) => (
  <button
    className={`reference-link ${highlightActive ? 'active' : ''}`}
    onClick={() => onReferenceClick(referenceNumber)}
    onKeyDown={(e) => onKeyDown(e, referenceNumber)}
    aria-pressed={highlightActive}
    aria-controls="pdf-viewer"
    aria-label={label}
    tabIndex={0}
  >
    [{referenceNumber}]
  </button>
)

ReferenceButton.propTypes = {
  referenceNumber: PropTypes.number.isRequired,
  highlightActive: PropTypes.bool,
  onReferenceClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
}

/**
 * Analysis panel component with clickable reference links
 * Provides the analysis text and controls for highlighting
 */
export default function AnalysisPanel({ onHighlightToggle, highlightActive, onNumberClick, onReferenceClick, activeNumber }) {
  const handleReferenceClick = (referenceNumber) => {
    if (onReferenceClick) {
      onReferenceClick(referenceNumber)
    } else if (referenceNumber === 3) {
      // Fallback for backward compatibility
      onHighlightToggle()
    }
  }

  const handleNumberClick = (number) => {
    if (onNumberClick) {
      onNumberClick(number)
    }
  }

  const handleKeyDown = (event, referenceNumber) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleReferenceClick(referenceNumber)
    }
  }

  const handleNumberKeyDown = (event, number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleNumberClick(number)
    }
  }

  return (
    <div className="analysis-panel" aria-label="Analysis">
      <h2>Analysis</h2>

      <div className="analysis-content">
        <p>
          No extraordinary or one-off items affecting EBITDA were reported in Maersk's Q2 2025 results.
          The report explicitly notes that EBITDA improvements stemmed from operational performance—
          including volume growth, cost control, and margin improvement across Ocean, Logistics &amp; Services, and Terminals segments [1][2]. Gains or losses from asset sales, which could qualify as
          extraordinary items, are shown separately under EBIT and not included in EBITDA. The gain on
          sale of non-current assets was{' '}
          <NumberButton
            value="25 m"
            displayText="USD 25 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}in Q2 2025, significantly lower than{' '}
          <NumberButton
            value="208 m"
            displayText="USD 208 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}in Q2 2024, but these affect EBIT, not EBITDA [3]. Hence, Q2 2025 EBITDA reflects core operating
          activities without one-off extraordinary adjustments.
        </p>

        <h3>Findings</h3>
        <p>
          <strong>Page 3 — Highlights Q2 2025</strong><br/>
          EBITDA increase ({' '}
          <NumberButton
            value="2.3 bn"
            displayText="USD 2.3 bn"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}vs{' '}
          <NumberButton
            value="2.1 bn"
            displayText="USD 2.1 bn"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}prior year) attributed to operational improvements; no
          mention of extraordinary or one-off items.{' '}
          <ReferenceButton
            referenceNumber={1}
            highlightActive={highlightActive}
            onReferenceClick={handleReferenceClick}
            onKeyDown={handleKeyDown}
            label={`Reference 1: Page 3 highlights. ${highlightActive ? 'Highlight is active' : 'Click to highlight'}`}
          />
        </p>

        <p>
          <strong>Page 5 — Review Q2 2025</strong><br/>
          EBITDA rise driven by higher revenue and cost control across all segments; no extraordinary gains
          or losses included.{' '}
          <ReferenceButton
            referenceNumber={2}
            highlightActive={highlightActive}
            onReferenceClick={handleReferenceClick}
            onKeyDown={handleKeyDown}
            label={`Reference 2: Page 5 review. ${highlightActive ? 'Highlight is active' : 'Click to highlight'}`}
          />
        </p>

        <p>
          <strong>Page 15 — Condensed Income Statement</strong><br/>
          Gain on sale of non-current assets{' '}
          <NumberButton
            value="25"
            displayText="USD 25 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}(vs{' '}
          <NumberButton
            value="208"
            displayText="USD 208 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}prior year) reported separately below
          EBITDA; therefore, not part of EBITDA.{' '}
          <ReferenceButton
            referenceNumber={3}
            highlightActive={highlightActive}
            onReferenceClick={handleReferenceClick}
            onKeyDown={handleKeyDown}
            label={`Reference 3: Page 15 income statement. ${highlightActive ? 'Highlight is active' : 'Click to highlight'}`}
          />
        </p>

        <h3>Supporting Evidence</h3>
        <p>
          <strong>[1]</strong> A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025) — Page 3 →
          "Maersk's results continued to improve year-on-year … EBITDA of{' '}
          <NumberButton
            value="2.3 bn"
            displayText="USD 2.3 bn"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}(USD{' '}
          <NumberButton
            value="2.1 bn"
            displayText="2.1 bn"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {') … driven by volume and other revenue growth in Ocean, margin improvements in Logistics &amp; Services and significant top line growth in Terminals."'}
        </p>

        <p>
          <strong>[2]</strong> A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025) — Page 5 →
          "EBITDA increased to{' '}
          <NumberButton
            value="2.3 bn"
            displayText="USD 2.3 bn"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}(USD{' '}
          <NumberButton
            value="2.1 bn"
            displayText="2.1 bn"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {') … driven by higher revenue and cost management … Ocean'}
          {'s EBITDA … slightly increased by '}{' '}
          <NumberButton
            value="36 m"
            displayText="USD 36 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}… Logistics &amp; Services contributed significantly with a{' '}
          <NumberButton
            value="71 m"
            displayText="USD 71 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}increase … Terminals' EBITDA increased by{' '}
          <NumberButton
            value="50 m"
            displayText="USD 50 m"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}&quot;
        </p>

        <p>
          <strong>[3]</strong> A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025) — Page 15 →
          "Gain on sale of non-current assets, etc., net{' '}
          <NumberButton
            value="25"
            displayText="25"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {' '}({' '}
          <NumberButton
            value="208"
            displayText="208"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
          {') … Profit before depreciation, amortisation and impairment losses, etc. (EBITDA)'}{' '}
          <NumberButton
            value="2,298"
            displayText="2,298"
            activeNumber={activeNumber}
            onNumberClick={handleNumberClick}
            onKeyDown={handleNumberKeyDown}
          />
        </p>
      </div>

      <div className="analysis-controls">
        <button
          className="clear-highlight-btn"
          onClick={onHighlightToggle}
          disabled={!highlightActive}
          aria-label={highlightActive ? 'Clear highlight' : 'No highlight to clear'}
        >
          {highlightActive ? 'Clear Highlight' : 'No Highlight'}
        </button>
      </div>

      {/* Screen reader announcements for highlight state changes */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {highlightActive
          ? 'Highlight applied to page 15 of the PDF'
          : 'Highlight removed from PDF'
        }
      </div>
    </div>
  )
}

AnalysisPanel.propTypes = {
  onHighlightToggle: PropTypes.func,
  highlightActive: PropTypes.bool,
  onNumberClick: PropTypes.func,
  onReferenceClick: PropTypes.func,
  activeNumber: PropTypes.string
}
