import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  console.log('📦 Upload request received');
  
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const sessionId = cookies().get('sessionId')?.value;

  console.log('Session ID:', sessionId);
  console.log('File details:', {
    name: file?.name,
    type: file?.type,
    size: file?.size + ' bytes'
  });

  if (!sessionId || !file) {
    console.error('❌ Missing session ID or file');
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Save to /tmp/videos/{sessionId}
  const tmpDir = path.join(process.cwd(), 'tmp', 'videos', sessionId);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(tmpDir, file.name);
  fs.writeFileSync(filePath, buffer);
  
  console.log('📥 File saved to:', filePath);
  return NextResponse.json({ success: true });
}