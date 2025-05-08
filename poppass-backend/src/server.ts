import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// import bodyParser from 'body-parser'; // Use express.json() instead
import { config } from './config/env';
import { connectDB } from './config/db';
import eventRoutes from './routes/eventRoutes';
import claimRoutes from './routes/claimRoutes';
// import { ApiError } from './utils/errors';

const app = express();

// Connect Database
connectDB();

// Initialize Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define Routes
// Add return type : void
app.get('/api/health', (req: Request, res: Response): void => {
    res.json({ status: 'ok' });
});
app.use('/api/events', eventRoutes);
app.use('/api/claim', claimRoutes);

// Basic Error Handling Middleware
/*
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});
*/

// 404 Handler for undefined routes
app.use((req: Request, res: Response): void => { // Add : void
    res.status(404).json({ message: 'Not Found' });
});


const PORT = config.port;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Ensure backend wallet is loaded on startup
try {
    require('./services/solanaService').getBackendWallet();
} catch (e) {
    console.error("Failed to load backend wallet on startup:", e);
    process.exit(1);
}