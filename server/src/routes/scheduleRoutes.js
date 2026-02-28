import { Router } from 'express';
import { createSchedule, getScheduledMessages } from '../controllers/scheduleController.js';

const router = Router();
router.post('/', createSchedule);
router.get('/', getScheduledMessages);

export default router;
