process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

import { Readable } from 'stream';
import gTTS from 'gtts';

export const generateSpeech = async (req, res) => {
  try {
    const { text, lang = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const gtts = new gTTS(text, lang);

    // Set response headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="blog-audio.mp3"`);

    // Pipe the TTS stream directly to response
    gtts.stream().pipe(res);
    
  } catch (error) {
    console.error('TTS Streaming Error:', error);
    res.status(500).json({ error: 'Failed to stream audio' });
  }
};
