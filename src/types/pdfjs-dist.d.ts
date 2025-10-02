// src/types/pdfjs-dist.d.ts
declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }

  export interface TextItem {
    str: string;
    dir?: string;
    width?: number;
    height?: number;
    transform?: number[];
    fontName?: string;
    hasEOL?: boolean;
  }

  export interface TextMarkedContent {
    type: string;
    id?: string;
  }

  export interface TextContent {
    items: Array<TextItem | TextMarkedContent>;
    styles?: Record<string, unknown>;
    lang?: string;
  }

  export interface PDFPageProxy {
    pageNumber: number;
    getTextContent(): Promise<TextContent>;
    getViewport(params: { scale: number }): PDFPageViewport;
    cleanup(): void;
  }

  export interface PDFPageViewport {
    width: number;
    height: number;
    scale: number;
    rotation: number;
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
    destroy(): Promise<void>;
  }

  export interface DocumentInitParameters {
    data?: Uint8Array | ArrayBuffer;
    url?: string;
    httpHeaders?: Record<string, string>;
    withCredentials?: boolean;
    password?: string;
    length?: number;
    range?: { begin: number; end: number };
    rangeChunkSize?: number;
    worker?: unknown;
    verbosity?: number;
    docBaseUrl?: string;
    cMapUrl?: string;
    cMapPacked?: boolean;
    CMapReaderFactory?: unknown;
    useSystemFonts?: boolean;
    standardFontDataUrl?: string;
    StandardFontDataFactory?: unknown;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
    maxImageSize?: number;
    pdfBug?: boolean;
  }

  export function getDocument(
    source: string | Uint8Array | ArrayBuffer | DocumentInitParameters
  ): PDFDocumentLoadingTask;

  export const GlobalWorkerOptions: {
    workerSrc: string;
    workerPort?: unknown;
  };

  export const version: string;
}

// Fallback for the legacy path without .mjs extension
declare module 'pdfjs-dist/legacy/build/pdf' {
  export * from 'pdfjs-dist/legacy/build/pdf.mjs';
}