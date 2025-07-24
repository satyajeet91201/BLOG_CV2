process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import gTTS from 'gtts';

const app = express();
const PORT = 3000;

app.use(express.json());

// For __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
  res.send('✅ Text-to-Speech Server is running!');
});

app.post('/api/speak', async (req, res) => {
  try {
    const text = req.body.text;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required for conversion' });
    }

    const gtts = new gTTS(text, 'en');
    const outputPath = path.join(__dirname, 'output.mp3');

    gtts.save(outputPath, function (err) {
      if (err) {
        console.error('TTS Save Error:', err);
        return res.status(500).json({ error: 'Failed to generate speech' });
      }

      // Send the audio file back
      res.download(outputPath, 'speech.mp3', () => {
        // Optional: clean up file after sending
        fs.unlinkSync(outputPath);
      });
    });

  } catch (err) {
    console.error('TTS Error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🎤 TTS server listening on http://localhost:${PORT}`);
});
