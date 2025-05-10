import express from 'express';
import * as aiController from '../controllers/aiController';

const router = express.Router();
router.post('/ask-openai', aiController.handleOpenAIQuery);
export default router;