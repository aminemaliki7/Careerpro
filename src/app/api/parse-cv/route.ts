// src/app/api/parse-cv/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';

export const runtime = 'nodejs';
export const maxDuration = 30;

/**
 * Extracts text content from a PDF file buffer using unpdf
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    console.log('🔍 Extracting PDF from buffer, size:', buffer.length, 'bytes');

    const pdf = await getDocumentProxy(new Uint8Array(buffer));

    const { text } = await extractText(pdf, {
      mergePages: true,
    });

    console.log(`✅ unpdf: extracted ${text.length} characters`);

    if (!text || text.trim().length < 10) {
      throw new Error('PDF appears to be empty or contains only images');
    }

    return text.trim();
  } catch (err) {
    console.error('❌ PDF extraction failed:', err);
    throw new Error(
      `PDF parsing error: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
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