/**
 * EspressoJS v4.0.0 - Hybrid Application Example
 * 
 * This example demonstrates:
 * - Combining SSR and API in one application
 * - Serving both web pages and API endpoints
 * - Shared authentication
 * - Progressive enhancement
 */

const express = require('express');
const app = express();
const { asyncHandler } = require('@misterzik/espressojs/server/middleware/errorHandler');
const { body } = require('express-validator');
const { apiEnhancer } = require('@misterzik/espressojs');

// Simulated data store
let todos = [
  { id: 1, title: 'Learn EspressoJS', completed: false, userId: 1 },
  { id: 2, title: 'Build an app', completed: false, userId: 1 }
];

// ============================================
// SSR ROUTES (Web Pages)
// ============================================

// Home page - SSR
app.get('/', (req, res) => {
  res.renderView('index', {
    title: 'Todo App',
    description: 'A hybrid SSR + API application',
    user: req.user || null
  });
});

// Todo list page - SSR with initial data
app.get('/todos', asyncHandler(async (req, res) => {
  // Fetch todos for SSR
  const userTodos = req.user ? todos.filter(t => t.userId === req.user.id) : [];
  
  res.renderView('todos/index', {
    title: 'My Todos',
    todos: userTodos,
    user: req.user
  });
}));

// Single todo page - SSR
app.get('/todos/:id', asyncHandler(async (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  
  if (!todo) {
    return res.status(404).renderView('error', {
      statusCode: 404,
      message: 'Todo not found'
    });
  }
  
  res.renderView('todos/detail', {
    title: todo.title,
    todo,
    user: req.user
  });
}));

// About page - SSR
app.get('/about', (req, res) => {
  res.renderView('about', {
    title: 'About',
    version: '4.0.0'
  });
});

// ============================================
// API ROUTES (REST Endpoints)
// ============================================

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of todos
 */
app.get('/api/todos', asyncHandler(async (req, res) => {
  const userTodos = req.user ? todos.filter(t => t.userId === req.user.id) : todos;
  res.success(userTodos, 'Todos retrieved successfully');
}));

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get todo by ID
 *     tags: [Todos]
 */
app.get('/api/todos/:id', asyncHandler(async (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  
  if (!todo) {
    return res.error('Todo not found', 404);
  }
  
  res.success(todo);
}));

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 */
app.post('/api/todos',
  [
    body('title').trim().notEmpty().isLength({ min: 3, max: 100 })
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const newTodo = {
      id: todos.length + 1,
      title: req.body.title,
      completed: false,
      userId: req.user ? req.user.id : 1
    };
    
    todos.push(newTodo);
    
    res.success(newTodo, 'Todo created successfully', 201);
  })
);

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update todo
 *     tags: [Todos]
 */
app.put('/api/todos/:id',
  [
    body('title').optional().trim().isLength({ min: 3, max: 100 }),
    body('completed').optional().isBoolean()
  ],
  apiEnhancer.validationMiddleware(),
  asyncHandler(async (req, res) => {
    const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
    
    if (todoIndex === -1) {
      return res.error('Todo not found', 404);
    }
    
    todos[todoIndex] = {
      ...todos[todoIndex],
      ...req.body
    };
    
    res.success(todos[todoIndex], 'Todo updated successfully');
  })
);

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete todo
 *     tags: [Todos]
 */
app.delete('/api/todos/:id', asyncHandler(async (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  
  if (todoIndex === -1) {
    return res.error('Todo not found', 404);
  }
  
  todos.splice(todoIndex, 1);
  
  res.success(null, 'Todo deleted successfully');
}));

// ============================================
// PROGRESSIVE ENHANCEMENT
// ============================================

// Form submission endpoint that works with or without JavaScript
app.post('/todos/create', asyncHandler(async (req, res) => {
  const { title } = req.body;
  
  if (!title || title.trim().length < 3) {
    // If JavaScript is disabled, redirect with error
    if (!req.xhr && !req.headers.accept?.includes('application/json')) {
      return res.redirect('/todos?error=invalid_title');
    }
    // If JavaScript is enabled, return JSON
    return res.error('Title must be at least 3 characters', 400);
  }
  
  const newTodo = {
    id: todos.length + 1,
    title: title.trim(),
    completed: false,
    userId: req.user ? req.user.id : 1
  };
  
  todos.push(newTodo);
  
  // Progressive enhancement: respond based on request type
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    // AJAX request - return JSON
    res.success(newTodo, 'Todo created successfully', 201);
  } else {
    // Form submission - redirect to todos page
    res.redirect('/todos');
  }
}));

// Toggle todo completion (works with or without JavaScript)
app.post('/todos/:id/toggle', asyncHandler(async (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  
  if (todoIndex === -1) {
    if (!req.xhr && !req.headers.accept?.includes('application/json')) {
      return res.redirect('/todos?error=not_found');
    }
    return res.error('Todo not found', 404);
  }
  
  todos[todoIndex].completed = !todos[todoIndex].completed;
  
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    res.success(todos[todoIndex], 'Todo updated');
  } else {
    res.redirect('/todos');
  }
}));

// ============================================
// CLIENT-SIDE EXAMPLE (for reference)
// ============================================

/*
<!-- In your SSR template (views/todos/index.ejs) -->
<div id="todos-app">
  <!-- Server-rendered initial content -->
  <% todos.forEach(todo => { %>
    <div class="todo-item" data-id="<%= todo.id %>">
      <input type="checkbox" <%= todo.completed ? 'checked' : '' %>>
      <span><%= todo.title %></span>
    </div>
  <% }); %>
</div>

<script>
  // Progressive enhancement: Add JavaScript functionality
  document.addEventListener('DOMContentLoaded', () => {
    // If JavaScript is available, use AJAX
    document.querySelectorAll('.todo-item input').forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const todoId = e.target.closest('.todo-item').dataset.id;
        
        try {
          const response = await fetch(`/api/todos/${todoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: e.target.checked })
          });
          
          const result = await response.json();
          console.log('Updated:', result);
        } catch (error) {
          console.error('Error:', error);
          // Fallback to form submission
          e.target.closest('form').submit();
        }
      });
    });
  });
</script>
*/

module.exports = app;
