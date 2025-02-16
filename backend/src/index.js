import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // Ensure the correct import path
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3002;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',  // Ensure frontend URL is correct
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow cookies to be sent
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);  // Use the authRoutes for login and registration

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
