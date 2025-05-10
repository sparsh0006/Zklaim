import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env'; 
import { connectDB } from './config/db';
import eventRoutes from './routes/eventRoutes';
import claimRoutes from './routes/claimRoutes';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});


app.use('/api/events', eventRoutes);
app.use('/api/claim', claimRoutes);
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = config.port; 
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

try {
  require('./services/solanaService').getBackendWallet();
} catch (e) {
  console.error("❌ Failed to load backend wallet on startup:", e);
  process.exit(1);
}