import express from 'express';
import cors from 'cors';
import contactsRoutes from './routes/contactsRoutes.js';
import devicesRoutes from './routes/devicesRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/contacts', contactsRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
