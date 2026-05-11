# Security Best Practices

## Overview

Espresso.js v4.0.0 includes comprehensive security features designed to protect your application from common vulnerabilities. This guide covers all security aspects and best practices.

## Built-in Security Features

### 1. Helmet - HTTP Security Headers

**What it does**: Sets secure HTTP headers to protect against common attacks

**Enabled by default**: Yes

**Headers set**:
- Content Security Policy (CSP)
- X-Content-Type-Options (nosniff)
- X-Frame-Options (deny)
- Strict-Transport-Security (HSTS)
- X-XSS-Protection
- Referrer-Policy

**Configuration**:
```json
{
  "security": {
    "strictCSP": false
  }
}
```

**Strict CSP** (Production recommended):
```json
{
  "security": {
    "strictCSP": true
  }
}
```

### 2. Rate Limiting

**What it does**: Prevents brute-force and DDoS attacks

**Enabled by default**: Yes

**Default limits**:
- 100 requests per 15 minutes (general)
- 10 requests per 15 minutes (strict)
- 200 requests per 15 minutes (API)

**Configuration**:
```json
{
  "security": {
    "rateLimit": {
      "enabled": true,
      "windowMs": 900000,
      "max": 100
    }
  }
}
```

**Custom rate limiter**:
```javascript
const { createRateLimiter } = require('./server/middleware/security');

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts'
});

app.post('/login', loginLimiter, handleLogin);
```

### 3. MongoDB Sanitization

**What it does**: Prevents NoSQL injection attacks

**Enabled by default**: Yes

**How it works**: Removes `$` and `.` from user input

**Example**:
```javascript
// Malicious input
{ "username": { "$gt": "" } }

// After sanitization
{ "username": { "_gt": "" } }
```

### 4. HTTP Parameter Pollution (HPP)

**What it does**: Prevents parameter pollution attacks

**Enabled by default**: Yes

**Example**:
```
// Attack attempt
?id=1&id=2&id=3

// HPP prevents confusion about which value to use
```

### 5. CORS Protection

**What it does**: Controls cross-origin resource sharing

**Enabled by default**: Yes (permissive)

**Recommended production config**:
```javascript
const corsOptions = {
  origin: ['https://yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 6. Input Validation

**What it does**: Validates and sanitizes user input

**Library**: express-validator

**Example**:
```javascript
const { body } = require('express-validator');

app.post('/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).trim(),
    body('name').trim().escape(),
  ],
  validationMiddleware(),
  createUser
);
```

## Common Vulnerabilities & Protection

### 1. SQL/NoSQL Injection

**Risk**: Attackers inject malicious queries

**Protection**:
- ✅ MongoDB sanitization (built-in)
- ✅ Input validation
- ✅ Parameterized queries

**Example**:
```javascript
// ❌ VULNERABLE
const user = await User.findOne({ username: req.body.username });

// ✅ SAFE (sanitized automatically)
const user = await User.findOne({ username: req.body.username });

// ✅ EXTRA SAFE (with validation)
body('username').trim().escape().isLength({ min: 3, max: 20 })
```

### 2. Cross-Site Scripting (XSS)

**Risk**: Attackers inject malicious scripts

**Protection**:
- ✅ Helmet CSP headers
- ✅ Input sanitization
- ✅ Output escaping in templates

**Example**:
```javascript
// ❌ VULNERABLE
res.send(`<h1>Welcome ${req.query.name}</h1>`);

// ✅ SAFE (EJS auto-escapes)
res.renderView('welcome', { name: req.query.name });
// Template: <h1>Welcome <%= name %></h1>

// ❌ DANGEROUS (unescaped)
// Template: <h1>Welcome <%- name %></h1>
```

### 3. Cross-Site Request Forgery (CSRF)

**Risk**: Unauthorized actions on behalf of authenticated users

**Protection**: Implement CSRF tokens

**Example**:
```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.renderView('form', { csrfToken: req.csrfToken() });
});

app.post('/submit', csrfProtection, (req, res) => {
  // Protected endpoint
});
```

**Template**:
```html
<form method="POST" action="/submit">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  <!-- form fields -->
</form>
```

### 4. Brute Force Attacks

**Risk**: Attackers try multiple passwords

**Protection**:
- ✅ Rate limiting (built-in)
- ✅ Account lockout
- ✅ CAPTCHA

**Example**:
```javascript
const loginAttempts = new Map();

app.post('/login', async (req, res) => {
  const { email } = req.body;
  const attempts = loginAttempts.get(email) || 0;
  
  if (attempts >= 5) {
    return res.error('Account locked. Try again in 15 minutes', 429);
  }
  
  const user = await authenticate(req.body);
  
  if (!user) {
    loginAttempts.set(email, attempts + 1);
    setTimeout(() => loginAttempts.delete(email), 15 * 60 * 1000);
    return res.error('Invalid credentials', 401);
  }
  
  loginAttempts.delete(email);
  res.success({ token: generateToken(user) });
});
```

### 5. Sensitive Data Exposure

**Risk**: Leaking sensitive information

**Protection**:
- ✅ Environment variables for secrets
- ✅ Encrypted database connections
- ✅ HTTPS in production
- ✅ Secure headers

**Example**:
```javascript
// ❌ VULNERABLE
const config = {
  dbPassword: 'mypassword123',
  apiKey: 'secret-key'
};

// ✅ SAFE
const config = {
  dbPassword: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY
};

// ❌ VULNERABLE (exposing sensitive data)
res.json({ user: userObject });

// ✅ SAFE (selective exposure)
res.success({
  id: user.id,
  name: user.name,
  email: user.email
  // password and other sensitive fields excluded
});
```

### 6. Insecure Dependencies

**Risk**: Using packages with known vulnerabilities

**Protection**:
- ✅ Regular updates
- ✅ npm audit
- ✅ Dependabot alerts

**Commands**:
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force

# Check outdated packages
npm outdated
```

### 7. Insufficient Logging & Monitoring

**Risk**: Not detecting attacks

**Protection**:
- ✅ Winston logging (built-in)
- ✅ Request logging
- ✅ Error tracking

**Example**:
```javascript
const logger = require('./server/utils/logger');

// Log security events
app.post('/login', async (req, res) => {
  try {
    const user = await authenticate(req.body);
    logger.info(`Successful login: ${user.email} from ${req.ip}`);
  } catch (error) {
    logger.warn(`Failed login attempt: ${req.body.email} from ${req.ip}`);
  }
});

// Log suspicious activity
app.use((req, res, next) => {
  if (req.path.includes('../') || req.path.includes('..\\')) {
    logger.warn(`Path traversal attempt from ${req.ip}: ${req.path}`);
  }
  next();
});
```

## Authentication & Authorization

### JWT Tokens

**Example implementation**:
```javascript
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.error('No token provided', 401);
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.error('Invalid token', 401);
  }
};

// Protected route
app.get('/profile', verifyToken, (req, res) => {
  res.success({ user: req.user });
});
```

### API Key Authentication

**Example**:
```javascript
const { apiEnhancer } = require('./index');

const validKeys = [
  process.env.API_KEY_1,
  process.env.API_KEY_2
];

app.use('/api/protected', apiEnhancer.apiKeyAuth(validKeys));
```

### Role-Based Access Control (RBAC)

**Example**:
```javascript
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.error('Not authenticated', 401);
    }
    
    if (!roles.includes(req.user.role)) {
      return res.error('Insufficient permissions', 403);
    }
    
    next();
  };
};

// Admin only
app.delete('/users/:id', 
  verifyToken, 
  checkRole(['admin']), 
  deleteUser
);

// Admin or moderator
app.put('/posts/:id',
  verifyToken,
  checkRole(['admin', 'moderator']),
  updatePost
);
```

## Password Security

### Hashing

**Use bcrypt**:
```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

// Usage
app.post('/register', async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  const user = await User.create({
    email: req.body.email,
    password: hashedPassword
  });
  res.success(user);
});
```

### Password Requirements

```javascript
const { body } = require('express-validator');

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage('Password must contain uppercase, lowercase, number, and special character');

app.post('/register', [
  body('email').isEmail(),
  passwordValidation
], validationMiddleware(), register);
```

## Database Security

### MongoDB Connection

**Secure connection**:
```javascript
// ✅ SAFE (v4.0.0 automatically encodes credentials)
const credentials = `${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_TOKEN)}`;
const url = `mongodb+srv://${credentials}@${mongoUri}/${dbName}`;
```

### Query Security

```javascript
// ❌ VULNERABLE
const users = await User.find(req.query);

// ✅ SAFE (whitelist fields)
const allowedFields = ['name', 'email', 'role'];
const query = {};
allowedFields.forEach(field => {
  if (req.query[field]) {
    query[field] = req.query[field];
  }
});
const users = await User.find(query);
```

## File Upload Security

**Example with multer**:
```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

app.post('/upload', upload.single('image'), (req, res) => {
  res.success({ filename: req.file.filename });
});
```

## Production Checklist

### Environment

- [ ] Use HTTPS (TLS/SSL)
- [ ] Set `NODE_ENV=production`
- [ ] Use environment variables for secrets
- [ ] Enable strict CSP
- [ ] Configure proper CORS
- [ ] Use secure cookies

### Configuration

```javascript
// Production settings
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  
  // Secure cookies
  app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));
}
```

### Headers

```javascript
// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor logs for suspicious activity
- [ ] Set up alerts for security events
- [ ] Regular security audits

## Security Testing

### Manual Testing

```bash
# Test rate limiting
for i in {1..150}; do curl http://localhost:8080/api/users; done

# Test XSS protection
curl "http://localhost:8080/?name=<script>alert('xss')</script>"

# Test NoSQL injection
curl -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{"username": {"$gt": ""}, "password": {"$gt": ""}}'
```

### Automated Testing

```javascript
// Example with Jest
describe('Security', () => {
  test('should prevent NoSQL injection', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: { $gt: '' }, password: { $gt: '' } });
    
    expect(response.status).toBe(400);
  });
  
  test('should rate limit requests', async () => {
    const requests = Array(150).fill().map(() =>
      request(app).get('/api/users')
    );
    
    const responses = await Promise.all(requests);
    const tooManyRequests = responses.filter(r => r.status === 429);
    
    expect(tooManyRequests.length).toBeGreaterThan(0);
  });
});
```

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet Documentation](https://helmetjs.github.io/)

## Reporting Security Issues

If you discover a security vulnerability, please email security@vimedev.com instead of using the issue tracker.

## Summary

✅ **Built-in Protection**: Multiple layers of security  
✅ **Best Practices**: Following industry standards  
✅ **Easy Configuration**: Secure by default  
✅ **Comprehensive**: Covers common vulnerabilities  
✅ **Production Ready**: Battle-tested security measures
