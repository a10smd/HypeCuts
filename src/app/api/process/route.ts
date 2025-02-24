import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export async function POST() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'Session invalid' }, { status: 400 });
  }

  const tmpDir = path.join(
    process.cwd(),
    'tmp',
    'videos',
    sessionId.replace(/:/g, '_')
  );
  const inputVideo = path.join(tmpDir, 'uploadedVideo.mp4');
  const outputDir = path.join(tmpDir, 'clips');

  if (!fs.existsSync(inputVideo)) {
    return NextResponse.json({ error: 'Video not found' }, { status: 400 });
  }

  try {
    // Scene detection logic here
    const timestamps = [10, 20]; // Test with hardcoded timestamps first

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    await new Promise((resolve, reject) => {
      ffmpeg(inputVideo)
        .outputOptions([`-f segment`, `-segment_times ${timestamps.join(',')}`])
        .output(`${outputDir}/clip-%03d.mp4`)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}