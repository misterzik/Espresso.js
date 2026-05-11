# Server-Side Rendering (SSR) Guide

## Overview

Espresso.js v4.0.0 introduces comprehensive Server-Side Rendering (SSR) support, allowing you to build dynamic web applications with template engines while maintaining the same plug-and-play philosophy.

## Features

- **Multiple Template Engines**: EJS, Handlebars, Pug
- **Automatic View Resolution**: Convention-based view discovery
- **Layout Support**: Master pages and partials
- **Built-in Helpers**: Common template utilities
- **Production Caching**: Automatic template caching in production
- **SEO Friendly**: Server-rendered HTML for better SEO

## Quick Start

### 1. Enable SSR in Configuration

Update your `config.json`:

```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "viewsDir": "views",
      "cache": false,
      "layout": null
    }
  }
}
```

### 2. Create Views Directory

```bash
mkdir views
```

### 3. Create Your First Template

**views/index.ejs**:
```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <h1>Welcome to <%= title %></h1>
    <p><%= message %></p>
</body>
</html>
```

### 4. Render in Routes

**routes/index.js**:
```javascript
app.get('/', (req, res) => {
  res.renderView('index', {
    title: 'Espresso.js',
    message: 'Server-Side Rendering is working!'
  });
});
```

## Template Engines

### EJS (Default)

**Pros**: JavaScript-based, simple syntax, fast
**File Extension**: `.ejs`

```html
<h1><%= title %></h1>
<% if (user) { %>
  <p>Welcome, <%= user.name %>!</p>
<% } %>

<ul>
<% items.forEach(item => { %>
  <li><%= item %></li>
<% }); %>
</ul>
```

### Handlebars

**Pros**: Logic-less, clean separation, partials support
**File Extension**: `.hbs`

**Configuration**:
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "handlebars",
      "viewsDir": "views",
      "layout": "main"
    }
  }
}
```

**views/index.hbs**:
```handlebars
<h1>{{title}}</h1>
{{#if user}}
  <p>Welcome, {{user.name}}!</p>
{{/if}}

<ul>
{{#each items}}
  <li>{{this}}</li>
{{/each}}
</ul>
```

**views/layouts/main.hbs**:
```handlebars
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
</head>
<body>
    {{{body}}}
</body>
</html>
```

### Pug

**Pros**: Concise syntax, powerful features
**File Extension**: `.pug`

**Configuration**:
```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "pug",
      "viewsDir": "views"
    }
  }
}
```

**views/index.pug**:
```pug
doctype html
html
  head
    title= title
  body
    h1= title
    if user
      p Welcome, #{user.name}!
    
    ul
      each item in items
        li= item
```

## Built-in Helpers

Espresso.js provides several built-in template helpers:

### formatDate
```html
<!-- EJS -->
<p>Date: <%= helpers.formatDate(new Date()) %></p>

<!-- Handlebars -->
<p>Date: {{formatDate date}}</p>
```

### json
```html
<!-- EJS -->
<pre><%= helpers.json(data) %></pre>

<!-- Handlebars -->
<pre>{{json data}}</pre>
```

### Environment Variables
```html
<!-- EJS -->
<% if (isDevelopment) { %>
  <div class="debug">Debug Mode</div>
<% } %>

<!-- Handlebars -->
{{#if isDevelopment}}
  <div class="debug">Debug Mode</div>
{{/if}}
```

## Advanced Usage

### Custom Helpers

Add custom helpers in your configuration:

```javascript
const { ssrManager } = require('./index');

ssrManager.helpers.uppercase = (str) => str.toUpperCase();
ssrManager.helpers.truncate = (str, len) => str.substring(0, len) + '...';
```

### Layouts and Partials

**Directory Structure**:
```
views/
├── layouts/
│   └── main.ejs
├── partials/
│   ├── header.ejs
│   └── footer.ejs
└── index.ejs
```

**views/partials/header.ejs**:
```html
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
```

**views/index.ejs**:
```html
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
</head>
<body>
    <%- include('partials/header') %>
    
    <main>
        <h1><%= title %></h1>
        <p><%= message %></p>
    </main>
    
    <%- include('partials/footer') %>
</body>
</html>
```

### Dynamic Data Rendering

```javascript
const express = require('express');
const router = express.Router();

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    res.renderView('user-profile', {
      title: `${user.name}'s Profile`,
      user,
      isOwner: req.user && req.user.id === user.id
    });
  } catch (error) {
    res.status(404).renderView('error', {
      statusCode: 404,
      message: 'User not found'
    });
  }
});
```

### SEO Optimization

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<%= description %>">
    <meta name="keywords" content="<%= keywords.join(', ') %>">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<%= title %>">
    <meta property="og:description" content="<%= description %>">
    <meta property="og:image" content="<%= ogImage %>">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<%= title %>">
    
    <title><%= title %></title>
</head>
<body>
    <!-- Content -->
</body>
</html>
```

## Performance Optimization

### Template Caching

In production, templates are automatically cached:

```json
{
  "features": {
    "ssr": {
      "enabled": true,
      "engine": "ejs",
      "cache": true
    }
  }
}
```

### Conditional Rendering

```javascript
app.get('/dashboard', (req, res) => {
  const data = {
    title: 'Dashboard',
    user: req.user
  };
  
  // Only fetch expensive data if needed
  if (req.user.isPremium) {
    data.analytics = await getAnalytics(req.user.id);
  }
  
  res.renderView('dashboard', data);
});
```

## Hybrid Mode (SSR + API)

Espresso.js supports running SSR and API endpoints simultaneously:

```javascript
// SSR routes
app.get('/', (req, res) => {
  res.renderView('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.renderView('about', { title: 'About' });
});

// API routes
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.get('/api/posts', (req, res) => {
  res.json({ posts: [] });
});
```

## Error Handling

Create custom error pages:

**views/error.ejs**:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Error <%= statusCode %></title>
</head>
<body>
    <h1>Error <%= statusCode %></h1>
    <p><%= message %></p>
    
    <% if (isDevelopment && stack) { %>
        <pre><%= stack %></pre>
    <% } %>
    
    <a href="/">Go Home</a>
</body>
</html>
```

**Error Handler**:
```javascript
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).renderView('error', {
    statusCode: err.statusCode || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});
```

## Best Practices

### 1. Separate Concerns
- Keep business logic in controllers
- Use views only for presentation
- Pass processed data to templates

### 2. Security
- Always escape user input
- Use `<%=` in EJS (auto-escapes)
- Avoid `<%-` unless rendering trusted HTML

### 3. Performance
- Enable caching in production
- Minimize data passed to templates
- Use partials for reusable components

### 4. Maintainability
- Use consistent naming conventions
- Organize views by feature/route
- Document complex templates

## Migration from Static HTML

### Before (Static)
```
public/
├── index.html
├── about.html
└── contact.html
```

### After (SSR)
```
views/
├── index.ejs
├── about.ejs
└── contact.ejs

routes/
└── pages.js
```

**routes/pages.js**:
```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.renderView('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
  res.renderView('about', { title: 'About' });
});

router.get('/contact', (req, res) => {
  res.renderView('contact', { title: 'Contact' });
});

module.exports = router;
```

## Troubleshooting

### Views Not Found
- Check `viewsDir` path in config
- Ensure views directory exists
- Verify file extensions match engine

### Templates Not Updating
- Disable cache in development
- Restart server after config changes
- Clear node_modules cache if needed

### Helpers Not Working
- Ensure helpers are registered before routes
- Check helper function syntax
- Verify helper names in templates

## Examples

Complete examples are available in the `examples/ssr/` directory:

- **Blog**: Full-featured blog with posts and comments
- **Dashboard**: Admin dashboard with charts
- **E-commerce**: Product catalog with cart
- **Portfolio**: Personal portfolio site

## Next Steps

- [API Enhancement Guide](./API-ENHANCEMENT.md)
- [Security Best Practices](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)
