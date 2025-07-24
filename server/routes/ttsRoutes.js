// routes/ttsRoutes.js
import express from 'express';
import { generateSpeech } from '../controllers/ttsController.js';

const router = express.Router();

router.post('/', generateSpeech); // POST /api/tts

export default router;
