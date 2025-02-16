import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';  // Ensure correct import from db.js

// Register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Incoming registration request:", req.body);

  try {
    // Check if user already exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.log("No user found with email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',  // Set default expiration to 1 hour
    });

    console.log("JWT token generated:", token);

    res.status(200).json({ token });  // Send token in the response

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
