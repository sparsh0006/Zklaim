import express from 'express';
import * as eventController from '../controllers/eventController';

const router = express.Router();

router.post('/', eventController.createEventHandler);
router.get('/:eventId/public-details', eventController.getPublicEventDetailsHandler);

export default router;