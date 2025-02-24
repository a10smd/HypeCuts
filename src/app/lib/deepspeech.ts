import axios from 'axios';

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

export const transcribeAudio = async (audioUrl: string): Promise<string> => {
  try {
    // Step 1: Upload audio to AssemblyAI
    const uploadResponse = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      { url: audioUrl },
      { headers: { authorization: ASSEMBLYAI_API_KEY } }
    );
    const uploadUrl = uploadResponse.data.upload_url;

    // Step 2: Start transcription
    const transcriptionResponse = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      { audio_url: uploadUrl },
      { headers: { authorization: ASSEMBLYAI_API_KEY } }
    );
    const transcriptId = transcriptionResponse.data.id;

    // Step 3: Poll for transcription result
    let transcriptText = '';
    while (true) {
      const resultResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: ASSEMBLYAI_API_KEY } }
      );
      if (resultResponse.data.status === 'completed') {
        transcriptText = resultResponse.data.text;
        break;
      } else if (resultResponse.data.status === 'error') {
        throw new Error('Transcription failed');
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    }

    return transcriptText;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Transcription failed');
  }
};
export const uploadToAssemblyAI = async (filePath: string): Promise<string> => {
    const fileData = fs.readFileSync(filePath);
    const uploadResponse = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      fileData,
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          'content-type': 'application/octet-stream',
        },
      }
    );
    return uploadResponse.data.upload_url;
  };