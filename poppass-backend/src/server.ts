import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/db';
import eventRoutes from './routes/eventRoutes';
import claimRoutes from './routes/claimRoutes';

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all origins
app.use(cors());

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/claim', claimRoutes);

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handling middleware (optional - enable if needed)
/*
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
*/

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

// Load backend wallet on startup
try {
  require('./services/solanaService').getBackendWallet();
} catch (e) {
  console.error("❌ Failed to load backend wallet on startup:", e);
  process.exit(1);
}
