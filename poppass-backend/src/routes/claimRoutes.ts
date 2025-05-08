import express from 'express';
import * as claimController from '../controllers/claimController';

const router = express.Router();

// Route expects eventId in the URL path, e.g., POST /api/claim/65f1a2b3c4d5...
router.post('/:eventId', claimController.claimTokenHandler);

export default router;