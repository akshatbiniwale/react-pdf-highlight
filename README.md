# React PDF Highlight

A powerful React application for interactive PDF analysis and text highlighting. This tool enables users to navigate through PDF documents, highlight specific phrases, and explore referenced content through an integrated analysis panel.

![PDF Highlight Demo](/public/assets/result.png)

## What This Project Does

React PDF Highlight is designed for document analysis workflows, particularly financial reports and research documents. The application provides:

- **Interactive PDF Viewing**: Navigate through multi-page PDF documents with intuitive page controls
- **Dynamic Text Highlighting**: Click references in the analysis panel to automatically highlight corresponding text in the PDF
- **Smart Navigation**: Jump directly to relevant pages and phrases mentioned in analysis summaries
- **Financial Document Analysis**: Pre-configured for analyzing financial reports like the Maersk Q2 2025 Interim Report
- **Reference Management**: Clickable reference numbers and page links for seamless document exploration

## Features

- 📄 **PDF Navigation**: Previous/Next page buttons and direct page input
- 🔍 **Text Highlighting**: Automatic highlighting of specified phrases across PDF pages
- 📊 **Analysis Panel**: Interactive panel with clickable references and page links
- 🎯 **Smart References**: Reference numbers that navigate to specific pages and highlight relevant text
- 📱 **Responsive Design**: Clean, modern UI optimized for document analysis workflows
- ⚡ **Fast Rendering**: Built with React and Vite for smooth performance

## Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.7** - Fast build tool and development server

### PDF Processing
- **react-pdf 10.2.0** - React components for PDF rendering
- **pdfjs-dist 5.4.296** - PDF.js library for PDF parsing and text extraction

### Development Tools
- **ESLint** - Code linting and formatting
- **Vite Plugin React** - Fast React HMR and compilation
- **PropTypes** - Runtime type checking for React components

## File Structure

```
react-pdf-highlight/
├── public/
│   ├── assets/
│   │   └── result.png          # Demo screenshot
│   └── Maersk_Q2_2025_Interim_Report.pdf  # Sample PDF document
├── src/
│   ├── components/
│   │   ├── AnalysisPanel.jsx    # Interactive analysis panel with references
│   │   ├── HighlightOverlay.jsx # Text highlighting overlay component
│   │   ├── PdfPageWithTextLayer.jsx # PDF page with text layer support
│   │   └── PdfViewer.jsx        # Main PDF viewer component
│   ├── utils/
│   │   └── pdfTextUtils.js      # PDF text processing utilities
│   ├── __tests__/               # Test files
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── index.css                # Global styles
│   └── main.jsx                 # Application entry point
├── package.json                 # Project dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # Project documentation
```

## How to Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akshatbiniwale/react-pdf-highlight.git
   cd react-pdf-highlight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Navigate Pages**: Use the Previous/Next buttons or enter a page number directly
2. **Highlight Text**: Click reference numbers `[1]`, `[2]`, `[3]` in the analysis panel to highlight corresponding text
3. **Jump to Pages**: Click "Page X" links to navigate directly to specific pages
4. **Clear Highlights**: Use the "Clear Highlight" button to remove active highlights

