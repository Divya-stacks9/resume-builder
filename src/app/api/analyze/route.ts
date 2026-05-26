import { NextRequest, NextResponse } from 'next/server';
import { extractText } from '@/utils/parser';
import { analyzeResumeRuleBased } from '@/utils/analyzer';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetRole = formData.get('targetRole') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 });
    }
    if (!targetRole || targetRole.trim() === '') {
      return NextResponse.json({ error: 'Target job role is required.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Identify format by MIME type or file extension
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    let text = '';
    try {
      if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
        text = await extractText(buffer, 'application/pdf');
      } else if (
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        fileName.endsWith('.docx')
      ) {
        text = await extractText(buffer, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      } else {
        return NextResponse.json({ 
          error: 'Unsupported file type. Please upload a PDF or DOCX file.' 
        }, { status: 400 });
      }
    } catch (parseError: any) {
      return NextResponse.json({ 
        error: `Text extraction failed: ${parseError.message || parseError}` 
      }, { status: 422 });
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No readable text could be extracted from your file. Make sure it is not a scanned image PDF.' 
      }, { status: 422 });
    }

    const analysis = analyzeResumeRuleBased(text, targetRole);

    return NextResponse.json({
      success: true,
      text,
      analysis,
    });
  } catch (error: any) {
    console.error('Error in analyze API route:', error);
    return NextResponse.json({ 
      error: error?.message || 'An unexpected server error occurred during analysis.' 
    }, { status: 500 });
  }
}
