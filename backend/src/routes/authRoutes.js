import express from 'express';
import * as authController from '../controllers/authController.js'; // Create a new controller for auth (login/register)

const router = express.Router();

// POST /register route
router.post('/register', authController.registerUser);

// POST /login route (if it's not already in your backend)
router.post('/login', authController.loginUser);

export default router;
