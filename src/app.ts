import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './api/index';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors()); // Sebaiknya dikonfigurasi lebih ketat di production
app.use(helmet());
app.use(morgan('dev'));

// API Routes
    app.use('/api/v1', apiRoutes);


// Error Handler (selalu di bagian akhir)
app.use(errorHandler);

export default app;