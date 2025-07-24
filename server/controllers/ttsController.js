process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


// controllers/ttsController.js
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import gTTS from 'gtts'; // If you're using gtts npm package

export const generateSpeech = async (req, res) => {
  try {
    const { text, lang = 'en' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const fileName = `speech-${Date.now()}.mp3`;
    const filePath = path.join('public', 'tts', fileName);

    const speech = new gTTS(text, lang);
    speech.save(filePath, (err) => {
      if (err) {
        console.error('TTS Error:', err);
        return res.status(500).json({ error: 'Failed to generate audio' });
      }

      res.status(200).json({
        status: 'success',
        audioUrl: `/tts/${fileName}`
      });
    });

  } catch (error) {
    console.error('TTS Controller Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
