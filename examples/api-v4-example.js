/**
 * EspressoJS v4.0.0 - Enhanced API Example
 * 
 * This example demonstrates:
 * - Swagger/OpenAPI documentation
 * - Response formatting (success, error, paginate)
 * - Request validation
 * - API versioning
 * - API key authentication
 * - Rate limiting
 */

const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const { asyncHandler } = require('@misterzik/espressojs/server/middleware/errorHandler');
const { apiEnhancer } = require('@misterzik/espressojs');

// Simulated database
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
];

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           description: User role
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: john@example.com
 *         role: admin
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 */
router.get('/users',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const total = users.length;
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    res.paginate(paginatedUsers, page, limit, total);
  })
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/users/:id',
  [
    param('id').isInt().toInt()
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.error('User not found', 404);
    }
    
    res.success(user, 'User retrieved successfully');
  })
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
router.post('/users',
  [
    body('name').trim().notEmpty().isLength({ min: 2, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('role').optional().isIn(['admin', 'user'])
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
      role: req.body.role || 'user'
    };
    
    users.push(newUser);
    
    res.success(newUser, 'User created successfully', 201);
  })
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put('/users/:id',
  [
    param('id').isInt().toInt(),
    body('name').optional().trim().isLength({ min: 2, max: 50 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['admin', 'user'])
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.error('User not found', 404);
    }
    
    users[userIndex] = {
      ...users[userIndex],
      ...req.body
    };
    
    res.success(users[userIndex], 'User updated successfully');
  })
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/users/:id',
  [
    param('id').isInt().toInt()
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.error('User not found', 404);
    }
    
    users.splice(userIndex, 1);
    
    res.success(null, 'User deleted successfully');
  })
);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/users/search',
  [
    query('q').trim().notEmpty()
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const query = req.query.q.toLowerCase();
    const results = users.filter(u => 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
    
    res.success(results, `Found ${results.length} users`);
  })
);

// Protected endpoint example (requires API key)
router.get('/users/admin/stats',
  apiEnhancer.apiKeyAuth([process.env.ADMIN_API_KEY]),
  asyncHandler(async (req, res) => {
    const stats = {
      totalUsers: users.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length
    };
    
    res.success(stats, 'Admin statistics retrieved');
  })
);

module.exports = router;
