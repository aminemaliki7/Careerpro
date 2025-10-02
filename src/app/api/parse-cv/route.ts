// src/app/api/parse-cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Extracts text from PDF using pdfjs-dist (Vercel-compatible)
 */
async function extractWithPdfJs(buffer: Buffer): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');

    // Disable worker in serverless environments
    pdfjsLib.GlobalWorkerOptions.workerSrc = null;

    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => item.str).join(' ') + '\n\n';
    }

    return fullText.trim();
  } catch (err) {
    console.error('❌ PDF extraction failed', err);
    throw err;
  }
}

/**
 * Extracts text from PDF using pdf-parse (local fallback)
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
 * Extracts text content from a PDF file buffer with fallback strategies
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  console.log('🔍 Extracting PDF from buffer, size:', buffer.length, 'bytes');

  const isVercel = process.env.VERCEL === '1';

  if (isVercel) {
    console.log('🌐 Running on Vercel - using pdfjs-dist');
    return await extractWithPdfJs(buffer);
  } else {
    console.log('💻 Running locally - trying pdf-parse first');
    try {
      return await extractWithPdfParse(buffer);
    } catch {
      console.warn('⚠️ pdf-parse failed, using pdfjs-dist fallback');
      return await extractWithPdfJs(buffer);
    }
  }
}

/**
 * Extracts raw text content from a DOCX buffer using mammoth
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Extracting DOCX from buffer, size:', buffer.length, 'bytes');
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length < 10) {
      throw new Error('Document appears empty or unreadable');
    }

    console.log(`✅ Successfully extracted ${result.value.length} characters from DOCX`);
    return result.value.trim();
  } catch (err) {
    console.error('❌ DOCX parsing error:', err);
    throw new Error('Failed to extract text from Word document.');
  }
}

/**
 * Main API handler for /api/parse-cv
 */
export async function POST(request: NextRequest) {
  console.log('🚀 parse-cv API called');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('📄 File received:', file.name, 'Type:', file.type, 'Size:', file.size, 'bytes');

    // Max 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      extractedText = await extractTextFromPDF(buffer);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      extractedText = await extractTextFromDOCX(buffer);
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'Legacy .doc files are not supported. Convert to .docx or use PDF/TXT.' },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Upload PDF, DOCX, or TXT.' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text. Ensure the file contains readable text.' },
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
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
