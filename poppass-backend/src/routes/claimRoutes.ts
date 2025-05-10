import express from 'express';
import * as claimController from '../controllers/claimController';

const router = express.Router();
router.post('/:eventId', claimController.claimTokenHandler);
export default router;