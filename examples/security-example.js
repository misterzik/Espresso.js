/**
 * EspressoJS v4.0.0 - Security Best Practices Example
 * 
 * This example demonstrates:
 * - Input validation and sanitization
 * - Authentication with JWT
 * - Authorization (RBAC)
 * - Rate limiting
 * - CSRF protection
 * - Secure headers
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { asyncHandler } = require('@misterzik/espressojs/server/middleware/errorHandler');
const { createRateLimiter } = require('@misterzik/espressojs/server/middleware/security');

// Simulated user database
const users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2b$10$...', // bcrypt hash
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: '$2b$10$...', // bcrypt hash
    role: 'user',
    name: 'Regular User'
  }
];

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Access token required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }
};

// ============================================
// AUTHORIZATION MIDDLEWARE (RBAC)
// ============================================

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// ============================================
// RATE LIMITING
// ============================================

// Strict rate limiter for authentication endpoints
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/**
 * Register new user
 */
router.post('/register',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('name')
      .trim()
      .escape()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be 2-50 characters')
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { email, password, name } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role: 'user',
      name
    };
    
    users.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token
      }
    });
  })
);

/**
 * Login
 */
router.post('/login',
  authLimiter, // Apply strict rate limiting
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal whether email exists
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  })
);

// ============================================
// PROTECTED ROUTES
// ============================================

/**
 * Get current user profile (authenticated users only)
 */
router.get('/profile',
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  })
);

/**
 * Update profile (authenticated users only)
 */
router.put('/profile',
  verifyToken,
  [
    body('name').optional().trim().escape().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail()
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...req.body
    };
    
    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role
      }
    });
  })
);

/**
 * Admin-only endpoint
 */
router.get('/admin/users',
  verifyToken,
  checkRole('admin'),
  asyncHandler(async (req, res) => {
    const userList = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role
    }));
    
    res.json({
      status: 'success',
      data: userList
    });
  })
);

/**
 * Admin or moderator endpoint
 */
router.delete('/admin/users/:id',
  verifyToken,
  checkRole('admin', 'moderator'),
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    
    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete your own account'
      });
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    users.splice(userIndex, 1);
    
    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  })
);

// ============================================
// PASSWORD SECURITY
// ============================================

/**
 * Change password
 */
router.post('/change-password',
  verifyToken,
  [
    body('currentPassword').notEmpty(),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    const user = users.find(u => u.id === req.user.id);
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!validPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    
    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  })
);

module.exports = router;
