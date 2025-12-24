/*
 * EspressoJS - Example API Routes
 * This file demonstrates how to create custom API routes
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { asyncHandler, AppError } = require('../server/middleware/errorHandler');

// Example: GET all items
router.get('/items', asyncHandler(async (req, res) => {
  const items = [
    { id: 1, name: 'Item 1', description: 'First item' },
    { id: 2, name: 'Item 2', description: 'Second item' },
  ];
  
  res.status(200).json({
    status: 'success',
    results: items.length,
    data: { items }
  });
}));

// Example: GET single item by ID
router.get('/items/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Simulate database lookup
  const item = { id, name: `Item ${id}`, description: 'Example item' };
  
  if (!item) {
    throw new AppError('Item not found', 404);
  }
  
  res.status(200).json({
    status: 'success',
    data: { item }
  });
}));

// Example: POST create new item with validation
router.post('/items',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isLength({ max: 500 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      });
    }
    
    const { name, description } = req.body;
    
    // Simulate database insert
    const newItem = {
      id: Date.now(),
      name,
      description,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      status: 'success',
      data: { item: newItem }
    });
  })
);

// Example: PUT update item
router.put('/items/:id',
  [
    body('name').optional().notEmpty(),
    body('description').optional().isLength({ max: 500 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // Simulate database update
    const updatedItem = {
      id,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.status(200).json({
      status: 'success',
      data: { item: updatedItem }
    });
  })
);

// Example: DELETE item
router.delete('/items/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Simulate database delete
  res.status(204).send();
}));

module.exports = router;
