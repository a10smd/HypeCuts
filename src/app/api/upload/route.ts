import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session invalid' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;

  const tmpDir = path.join(
    process.cwd(),
    'tmp',
    'videos',
    sessionId.replace(/:/g, '_')
  );
  const videoPath = path.join(tmpDir, 'uploadedVideo.mp4');

  try {
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(videoPath, buffer);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}