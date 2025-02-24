import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export async function GET() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session invalid' }, { status: 400 });
  }

  const clipsDir = path.join(
    process.cwd(),
    'tmp',
    'videos',
    sessionId.replace(/:/g, '_'),
    'clips'
  );

  // Verify clips exist
  if (!fs.existsSync(clipsDir)) {
    return NextResponse.json({ error: 'No clips found' }, { status: 400 });
  }

  const files = fs.readdirSync(clipsDir);
  if (files.length === 0) {
    return NextResponse.json({ error: 'No clips found' }, { status: 400 });
  }

  // Create ZIP
  const zip = new JSZip();
  files.forEach((file) => {
    const fileData = fs.readFileSync(path.join(clipsDir, file));
    zip.file(file, fileData);
  });

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

  return new NextResponse(zipBuffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="hypecuts-${sessionId}.zip"`,
    },
  });
}