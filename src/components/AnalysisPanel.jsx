import React from 'react'
import PropTypes from 'prop-types'

// Helper component for page navigation
const PageLink = ({ pageNumber, onPageClick }) => (
  <button
    className="page-link"
    onClick={() => onPageClick(pageNumber)}
    aria-label={`Go to page ${pageNumber}`}
    tabIndex={0}
  >
    Page {pageNumber}
  </button>
)

PageLink.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired
}

// Helper component for reference buttons
const ReferenceButton = ({ referenceNumber, onReferenceClick }) => (
  <button
    className="reference-link"
    onClick={() => onReferenceClick(referenceNumber)}
    aria-label={`Highlight reference ${referenceNumber}`}
    tabIndex={0}
  >
    [{referenceNumber}]
  </button>
)

ReferenceButton.propTypes = {
  referenceNumber: PropTypes.number.isRequired,
  onReferenceClick: PropTypes.func.isRequired
}

/**
 * Analysis panel component with clickable reference links
 * Provides the analysis text and controls for highlighting
 */
export default function AnalysisPanel({ onHighlightToggle, highlightActive, onReferenceClick, onPageNavigate }) {
  const handleReferenceClick = (referenceNumber) => {
    if (onReferenceClick) {
      onReferenceClick(referenceNumber)
    } else if (referenceNumber === 3) {
      // Fallback for backward compatibility
      onHighlightToggle()
    }
  }

  const handlePageClick = (pageNumber) => {
    if (onPageNavigate) {
      onPageNavigate(pageNumber)
    }
  }

  return (
    <div className="analysis-panel" aria-label="Analysis">
      <h2>Analysis</h2>

      <div className="analysis-content">
        <p>
          No extraordinary or one-off items affecting EBITDA were reported in Maersk's Q2 2025 results.
          The report explicitly notes that EBITDA improvements stemmed from operational performance—
          including volume growth, cost control, and margin improvement across Ocean, Logistics &amp;
          Services, and Terminals segments [1][2]. Gains or losses from asset sales, which could qualify as
          extraordinary items, are shown separately under EBIT and not included in EBITDA. The gain on
          sale of non-current assets was USD 25 m in Q2 2025, significantly lower than USD 208 m in Q2
          2024, but these affect EBIT, not EBITDA [3]. Hence, Q2 2025 EBITDA reflects core operating
          activities without one-off extraordinary adjustments.
        </p>

        <h3>Findings</h3>
        <p>
          <PageLink pageNumber={3} onPageClick={handlePageClick} /> — Highlights Q2 2025<br/>
          EBITDA increase (USD 2.3 bn vs USD 2.1 bn prior year) attributed to operational improvements; no
          mention of extraordinary or one-off items.{' '}
          <ReferenceButton referenceNumber={1} onReferenceClick={handleReferenceClick} />
        </p>

        <p>
          <PageLink pageNumber={5} onPageClick={handlePageClick} /> — Review Q2 2025<br/>
          EBITDA rise driven by higher revenue and cost control across all segments; no extraordinary gains
          or losses included.{' '}
          <ReferenceButton referenceNumber={2} onReferenceClick={handleReferenceClick} />
        </p>

        <p>
          <PageLink pageNumber={15} onPageClick={handlePageClick} /> — Condensed Income Statement<br/>
          Gain on sale of non-current assets USD 25 m (vs USD 208 m prior year) reported separately below
          EBITDA; therefore, not part of EBITDA.{' '}
          <ReferenceButton referenceNumber={3} onReferenceClick={handleReferenceClick} />
        </p>

        <h3>Supporting Evidence</h3>
        <p>
          <ReferenceButton referenceNumber={1} onReferenceClick={handleReferenceClick} /> A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025) — <PageLink pageNumber={3} onPageClick={handlePageClick} /> →
          "Maersk's results continued to improve year-on-year … EBITDA of USD 2.3 bn (USD 2.1 bn) …
          driven by volume and other revenue growth in Ocean, margin improvements in Logistics &amp;
          Services and significant top line growth in Terminals."
        </p>

        <p>
          <ReferenceButton referenceNumber={2} onReferenceClick={handleReferenceClick} /> A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025) — <PageLink pageNumber={5} onPageClick={handlePageClick} /> →
          "EBITDA increased to USD 2.3 bn (USD 2.1 bn) … driven by higher revenue and cost management
          … Ocean's EBITDA … slightly increased by USD 36 m … Logistics &amp; Services contributed
          significantly with a USD 71 m increase … Terminals' EBITDA increased by USD 50 m."
        </p>

        <p>
          <ReferenceButton referenceNumber={3} onReferenceClick={handleReferenceClick} /> A.P. Moller – Maersk Q2 2025 Interim Report (7 Aug 2025) — <PageLink pageNumber={15} onPageClick={handlePageClick} /> →
          "Gain on sale of non-current assets, etc., net 25 (208) … Profit before depreciation, amortisation
          and impairment losses, etc. (EBITDA) 2,298"
        </p>
      </div>

      <div className="analysis-controls">
        <button
          className="clear-highlight-btn"
          onClick={onHighlightToggle}
          disabled={!highlightActive}
          aria-label={highlightActive ? 'Clear highlight' : 'No highlight to clear'}
        >
          Clear Highlight
        </button>
      </div>
    </div>
  )
}

AnalysisPanel.propTypes = {
  onHighlightToggle: PropTypes.func,
  highlightActive: PropTypes.bool,
  onReferenceClick: PropTypes.func,
  onPageNavigate: PropTypes.func
}
