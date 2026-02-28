import { Router } from 'express';
import { addDevice, getDevices } from '../controllers/devicesController.js';

const router = Router();
router.post('/', addDevice);
router.get('/', getDevices);

export default router;
