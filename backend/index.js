import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';


const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transaction.js';
import budgetRoutes from './routes/budget.js';
import aiRoutes from './routes/ai.js';
import resetPasswordRoutes from './routes/resetPassword.js';

const app = express();




// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resetPassword', resetPasswordRoutes);


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));