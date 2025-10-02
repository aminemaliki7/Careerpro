declare module "pdfjs-dist/legacy/build/pdf" {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface TextItem {
    str: string;
    dir?: string;
    width?: number;
    height?: number;
    transform?: unknown;
    fontName?: string;
  }

  export interface TextContent {
    items: TextItem[];
    styles?: Record<string, unknown>;
    lang?: string;
  }

  export interface PDFPageProxy {
    getTextContent(): Promise<TextContent>;
  }

  export const getDocument: (source: Uint8Array | { data: Uint8Array }) => {
    promise: Promise<PDFDocumentProxy>;
  };

  export const GlobalWorkerOptions: {
    workerSrc: string | null;
  };
}
