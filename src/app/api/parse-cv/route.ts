// FIXED VERSION - Works around pdf-parse debug mode issue
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Extracts text content from a PDF file buffer using pdf-parse.
 * Dynamically imports pdf-parse to avoid module-level debug code execution.
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Extracting PDF from buffer, size:', buffer.length, 'bytes');
    
    // Dynamic import to bypass the debug mode check at module load
    const pdfParse = (await import('pdf-parse')).default;
    
    // Pass empty options object to force in-memory processing
    const data = await pdfParse(buffer, {});
    
    if (!data.text || data.text.trim().length < 10) {
      throw new Error('PDF appears to be empty or contains only images.');
    }

    console.log(`✅ Successfully extracted ${data.text.length} characters from PDF (${data.numpages} pages)`);
    return data.text.trim();
  } catch (err) {
    console.error('❌ PDF parsing error:', err);
    
    if (err instanceof Error) {
      if (err.message.includes('password')) {
        throw new Error('This PDF is password protected. Please use an unprotected file.');
      }
      if (err.message.includes('ENOENT')) {
        throw new Error('PDF parsing library error. Please try again or use a different file format.');
      }
    }
    
    throw new Error('Failed to extract text from PDF. The file may be image-based or corrupted.');
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
  console.log('🚀 parse-cv API called - Fixed version with dynamic import');
  
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

    // Convert file to buffer for processing libraries
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
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}