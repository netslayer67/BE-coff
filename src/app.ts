import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './api';

const app: Application = express();

// Middleware
app.use(cors()); // Cukup gunakan cors() standar
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// API Routes
app.get('/', (req, res) => res.send('Coffee Shop API is running...'));
app.use('/api/v1', apiRoutes);

// Error Handler
app.use(errorHandler);

export default app;