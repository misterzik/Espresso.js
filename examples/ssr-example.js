/**
 * EspressoJS v4.0.0 - Server-Side Rendering Example
 * 
 * This example demonstrates:
 * - Setting up SSR routes
 * - Rendering views with data
 * - Using layouts and partials
 * - Dynamic data binding
 * - Error pages
 */

const express = require('express');
const router = express.Router();
const { asyncHandler } = require('@misterzik/espressojs/server/middleware/errorHandler');

// Home page
router.get('/', (req, res) => {
  res.renderView('index', {
    title: 'EspressoJS v4.0.0',
    message: 'Welcome to Server-Side Rendering!',
    features: [
      'EJS, Handlebars, Pug support',
      'Layout and partial support',
      'Production caching',
      'SEO friendly'
    ]
  });
});

// About page
router.get('/about', (req, res) => {
  res.renderView('about', {
    title: 'About Us',
    description: 'Learn more about EspressoJS',
    team: [
      { name: 'John Doe', role: 'Developer' },
      { name: 'Jane Smith', role: 'Designer' }
    ]
  });
});

// Blog list page
router.get('/blog', asyncHandler(async (req, res) => {
  // Simulate fetching blog posts
  const posts = [
    {
      id: 1,
      title: 'Getting Started with EspressoJS',
      excerpt: 'Learn how to build modern web apps...',
      author: 'John Doe',
      date: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'SSR Best Practices',
      excerpt: 'Server-side rendering tips and tricks...',
      author: 'Jane Smith',
      date: new Date('2024-01-10')
    }
  ];

  res.renderView('blog/index', {
    title: 'Blog',
    posts,
    pagination: {
      page: 1,
      totalPages: 5
    }
  });
}));

// Blog post detail page
router.get('/blog/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Simulate fetching a blog post
  const post = {
    id,
    title: 'Getting Started with EspressoJS',
    content: '<p>This is the full blog post content...</p>',
    author: 'John Doe',
    date: new Date('2024-01-15'),
    tags: ['nodejs', 'express', 'ssr']
  };

  res.renderView('blog/post', {
    title: post.title,
    post,
    relatedPosts: []
  });
}));

// Contact form page
router.get('/contact', (req, res) => {
  res.renderView('contact', {
    title: 'Contact Us',
    csrfToken: req.csrfToken ? req.csrfToken() : null
  });
});

// Contact form submission
router.post('/contact', asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  
  // Process form submission
  // Send email, save to database, etc.
  
  res.renderView('contact-success', {
    title: 'Thank You',
    name
  });
}));

// User profile page (dynamic)
router.get('/user/:username', asyncHandler(async (req, res) => {
  const { username } = req.params;
  
  // Simulate fetching user data
  const user = {
    username,
    name: 'John Doe',
    bio: 'Full-stack developer',
    avatar: '/images/avatar.png',
    posts: 42,
    followers: 1234
  };

  res.renderView('user/profile', {
    title: `${user.name} (@${username})`,
    user,
    isOwner: false // Set based on authentication
  });
}));

// Dashboard (authenticated)
router.get('/dashboard', asyncHandler(async (req, res) => {
  // Check authentication
  if (!req.user) {
    return res.redirect('/login');
  }

  // Fetch dashboard data
  const stats = {
    views: 1234,
    posts: 42,
    comments: 156,
    likes: 789
  };

  res.renderView('dashboard', {
    title: 'Dashboard',
    user: req.user,
    stats,
    recentActivity: []
  });
}));

// Search results page
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.renderView('search', {
      title: 'Search',
      query: '',
      results: []
    });
  }

  // Simulate search
  const results = [
    { title: 'Result 1', url: '/blog/1' },
    { title: 'Result 2', url: '/blog/2' }
  ];

  res.renderView('search', {
    title: `Search: ${q}`,
    query: q,
    results,
    count: results.length
  });
}));

// 404 error page
router.use((req, res) => {
  res.status(404).renderView('error', {
    statusCode: 404,
    message: 'Page not found',
    title: '404 - Not Found'
  });
});

module.exports = router;
