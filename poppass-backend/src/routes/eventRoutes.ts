import express from 'express';
import * as eventController from '../controllers/eventController';

const router = express.Router();

router.post('/', eventController.createEventHandler);
// router.get('/:eventId/qr-code', eventController.getEventQrCodeHandler); // Uncomment if using QR endpoint

export default router;