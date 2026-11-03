import { NextResponse } from 'next/server';
import { uploadFile } from '../../../lib/upload';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('upload'); // CKEditor specifically sends the file in the 'upload' field

    if (!file) {
      return NextResponse.json({ error: { message: "No file provided" } }, { status: 400 });
    }

    const url = await uploadFile(file, 'editor');

    // CKEditor 5 expects a very specific JSON response format
    return NextResponse.json({
      url: url
    });

  } catch (error) {
    console.error("CKEditor Upload Error:", error);
    return NextResponse.json({
      error: { message: error.message || "Upload failed" }
    }, { status: 500 });
  }
}
