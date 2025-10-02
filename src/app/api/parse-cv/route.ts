// PRODUCTION-READY VERSION - Vercel-compatible PDF parsing
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Extracts text from PDF using pdfjs-dist (Vercel-compatible)
 */
async function extractWithPdfJs(buffer: Buffer): Promise<string> {
  try {
    // Import pdfjs-dist dynamically
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source for serverless environment
    // Use CDN-hosted worker for Vercel compatibility
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs`;
    
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: unknown) => {
          // Handle both TextItem and TextMarkedContent types
          if (item && typeof item === 'object' && 'str' in item) {
            return (item as { str: string }).str;
          }
          return '';
        })
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    const trimmedText = fullText.trim();
    if (!trimmedText || trimmedText.length < 10) {
      throw new Error('PDF appears to be empty');
    }
    
    console.log(`✅ pdfjs-dist: extracted ${trimmedText.length} characters (${pdf.numPages} pages)`);
    return trimmedText;
  } catch (error) {
    console.error('❌ pdfjs-dist error:', error);
    throw error;
  }
}

/**
 * Extracts text from PDF using pdf-parse (local development fallback)
 */
async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer, { max: 0 });
    
    if (!data.text || data.text.trim().length < 10) {
      throw new Error('PDF appears to be empty');
    }
    
    console.log(`✅ pdf-parse: extracted ${data.text.length} characters (${data.numpages} pages)`);
    return data.text.trim();
  } catch (error) {
    console.error('❌ pdf-parse error:', error);
    throw error;
  }
}

/**
 * Extracts text content from a PDF file buffer with fallback strategies.
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  console.log('🔍 Extracting PDF from buffer, size:', buffer.length, 'bytes');
  
  // Check if we're on Vercel (production) or local development
  const isVercel = process.env.VERCEL === '1';
  
  if (isVercel) {
    // On Vercel: Only use pdfjs-dist (pdf-parse doesn't work)
    console.log('🌐 Running on Vercel - using pdfjs-dist');
    try {
      return await extractWithPdfJs(buffer);
    } catch (error) {
      console.error('❌ PDF extraction failed on Vercel');
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    // Local development: Try pdf-parse first (faster), then pdfjs-dist
    console.log('💻 Running locally - trying pdf-parse first');
    try {
      return await extractWithPdfParse(buffer);
    } catch (pdfParseError) {
      console.warn('⚠️ pdf-parse failed, trying pdfjs-dist fallback...');
      
      try {
        return await extractWithPdfJs(buffer);
      } catch (pdfjsError) {
        console.error('❌ Both PDF methods failed');
        
        // Check for specific error types
        if (pdfParseError instanceof Error && pdfParseError.message.includes('password')) {
          throw new Error('This PDF is password protected. Please use an unprotected file.');
        }
        
        const errorDetails = `pdf-parse: ${pdfParseError instanceof Error ? pdfParseError.message : String(pdfParseError)}, pdfjs: ${pdfjsError instanceof Error ? pdfjsError.message : String(pdfjsError)}`;
        throw new Error(`Failed to extract text from PDF. Debug: ${errorDetails}`);
      }
    }
  }
}

/**
 * Extracts raw text content from a DOCX file buffer using mammoth.
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Extracting DOCX from buffer, size:', buffer.length, 'bytes');
    
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length < 10) {
      throw new Error('Document appears to be empty or could not be read.');
    }

    console.log(`✅ Successfully extracted ${result.value.length} characters from DOCX`);
    return result.value.trim();
  } catch (err) {
    console.error('❌ DOCX parsing error:', err);
    throw new Error('Failed to extract text from Word document. The file may be corrupted.');
  }
}

/**
 * Main handler for the /api/parse-cv POST request.
 */
export async function POST(request: NextRequest) {
  console.log('🚀 parse-cv API called - Vercel-compatible version');
  console.log('Environment:', process.env.VERCEL === '1' ? 'Vercel (Production)' : 'Local Development');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('❌ No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('📄 File received:', file.name, 'Type:', file.type, 'Size:', file.size, 'bytes');

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('✅ File converted to buffer');

    let extractedText = '';

    // Handle different file types
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      console.log('📝 Processing as TXT');
      extractedText = buffer.toString('utf-8');
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('📕 Processing as PDF');
      extractedText = await extractTextFromPDF(buffer);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      console.log('📘 Processing as DOCX');
      extractedText = await extractTextFromDOCX(buffer);
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'Legacy .doc files are not supported. Please convert to .docx or use PDF/TXT format.' },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the file. Please ensure the file contains readable text.' },
        { status: 400 }
      );
    }

    console.log('✅ Successfully extracted', extractedText.length, 'characters');

    return NextResponse.json({
      success: true,
      text: extractedText,
      length: extractedText.length,
    });
  } catch (error) {
    console.error('❌ Parse CV API error:', error);
    
    // Enhanced error logging for production debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}