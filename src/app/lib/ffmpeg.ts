import ffmpeg from 'fluent-ffmpeg';

export const splitVideoIntoClips = (
  inputPath: string,
  outputDir: string,
  timestamps: number[],
) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([`-f segment`, `-segment_times ${timestamps.join(',')}`])
      .output(`${outputDir}/clip-%03d.mp4`)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
};