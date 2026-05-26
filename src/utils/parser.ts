import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

// Polyfill/mock browser globals that pdf-parse's interior PDF.js dependency references
if (typeof global !== 'undefined') {
  if (!(global as any).DOMMatrix) {
    (global as any).DOMMatrix = class DOMMatrix {};
  }
  if (!(global as any).ImageData) {
    (global as any).ImageData = class ImageData {};
  }
  if (!(global as any).Path2D) {
    (global as any).Path2D = class Path2D {};
  }
}

/**
 * Extracts raw text from a PDF file buffer.
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Ensure it is a valid, unencrypted PDF.');
  } finally {
    await parser.destroy();
  }
}

/**
 * Extracts raw text from a DOCX file buffer.
 */
export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Ensure it is a valid, unencrypted DOCX file.');
  }
}

/**
 * Parses file based on content type and returns the extracted text.
 */
export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf' || mimeType.includes('pdf')) {
    return parsePdf(buffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType.includes('docx') ||
    mimeType.includes('officedocument')
  ) {
    return parseDocx(buffer);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
}
