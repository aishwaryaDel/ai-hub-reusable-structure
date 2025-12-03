import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import useCaseRoutes from './routes/useCaseRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { logTrace } from './utils/appInsights';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/use-cases', useCaseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  logTrace('Health check endpoint accessed');
  res.send('Tesa AI Hub Backend is running 🚀');
});

// Centralized error handler middleware (should be last)
app.use(errorHandler);

export default app;
