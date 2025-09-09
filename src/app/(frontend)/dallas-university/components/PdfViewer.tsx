'use client';

import { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker - Recommended approach
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PdfViewerProps {
  file: string;
  className?: string;
  width?: number;
  height?: number;
  pageNumber?: number;
  scale?: number;
  loading?: React.ReactNode;
  error?: React.ReactNode;
  onClick?: () => void;
}

export default function PdfViewer({
  file,
  className = '',
  width,
  height,
  pageNumber = 1,
  scale,
  loading = "Loading PDF...",
  error = "Failed to load PDF",
  onClick
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [devicePixelRatio, setDevicePixelRatio] = useState(2);

  // Set device pixel ratio on mount
  useMemo(() => {
    if (typeof window !== 'undefined') {
      setDevicePixelRatio(window.devicePixelRatio || 2);
    }
  }, []);

  // Configure PDF.js options
  const options = useMemo(() => ({
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  }), []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setLoadError(error.message);
  }

  if (loadError) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading PDF</p>
          <p className="text-sm text-gray-500">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${className}`} onClick={onClick}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex items-center justify-center p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kawai-red mx-auto mb-2"></div>
              <p className="text-gray-600">{loading}</p>
            </div>
          </div>
        }
        error={
          <div className="flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        }
        options={options}
      >
        <Page
          pageNumber={pageNumber}
          width={width}
          height={height}
          scale={scale}
          renderTextLayer={true}
          renderAnnotationLayer={true}
          className="pdf-page"
          devicePixelRatio={devicePixelRatio}
        />
      </Document>
      
      {numPages && (
        <div className="text-center mt-2 text-sm text-gray-500">
          Page {pageNumber} of {numPages}
        </div>
      )}
    </div>
  );
}