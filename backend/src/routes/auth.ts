import express, { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { userQueries } from '../database/queries';
import { generateTokens, verifyRefreshToken } from '../middleware/auth';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = express.Router();

// Sign Up
router.post('/signup', validateSignup, async (req: Request, res: Response) => {
  try {
    const { email, password, username, display_name } = req.body;

    // Check if user exists
    const existingUser = await userQueries.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUsername = await userQueries.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await userQueries.create({
      email,
      password: hashedPassword,
      username,
      display_name: display_name || username,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userQueries.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await userQueries.update(user.id, { last_login_at: new Date() });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
      },
      tokens: { accessToken, refreshToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh Token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    res.json({
      tokens: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  // In production, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' });
});

export default router;
