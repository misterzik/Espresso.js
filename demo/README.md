# EspressoJS v4.0.0 Demo

This demo shows how to use EspressoJS v4.0.0 with the latest features including SSR, API documentation, enhanced security, and the APIManager.

## 📁 Files

- **`config.json`** - Configuration file with API endpoints and settings
- **`espresso.js`** - Example routes using the new APIManager
- **`cli.js`** - CLI entry point
- **`public/index.html`** - Modern landing page with glassmorphism design

## 🚀 Quick Start

### 1. Install EspressoJS

```bash
npm install @misterzik/espressojs
```

### 2. Copy Demo Files

Copy the demo files to your project:

```bash
cp -r node_modules/@misterzik/espressojs/demo/* .
```

### 3. Run the Server

```bash
node cli run
```

Or use npm scripts:

```bash
npm start
```

### 4. Visit the App

Open your browser to:
- **Homepage**: http://localhost:8080
- **API Demo**: http://localhost:8080/api/v2/
- **API Health**: http://localhost:8080/api/v2/health

## 📋 Configuration

The `config.json` includes:

```json
{
  "instance": "development",
  "port": 8080,
  "publicDirectory": "/public",
  "mongoDB": {
    "enabled": false
  },
  "api": {
    "enabled": true,
    "uri": "https://swapi.dev/api/people/",
    "timeout": 30000,
    "retries": 0
  }
}
```

### Adding Multiple APIs

You can add multiple API endpoints:

```json
{
  "api": {
    "enabled": true,
    "uri": "https://api.example.com/v1/"
  },
  "api2": {
    "enabled": true,
    "uri": "https://api2.example.com/"
  },
  "api3": {
    "enabled": true,
    "uri": "https://api3.example.com/"
  }
}
```

## 🔧 Using the APIManager

The demo shows three examples:

### 1. Basic API Request

```javascript
router.get("/v2/", asyncHandler(async (req, res) => {
  const data = await apiManager.request('api', '');
  res.json({ status: 'success', data });
}));
```

### 2. Request with Parameters

```javascript
router.get("/v2/people/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await apiManager.request('api', `${id}/`);
  res.json({ status: 'success', data });
}));
```

### 3. Health Check

```javascript
router.get("/v2/health", (req, res) => {
  const apis = apiManager.getAllAPIs();
  res.json({
    status: 'ok',
    apis: Object.keys(apis),
    version: '3.3.4'
  });
});
```

## 🎨 Modern UI

The demo includes a beautiful landing page with:

- ☕ Animated coffee icon
- 🎨 Gradient background with glassmorphism
- 📱 Responsive design
- 🔗 Call-to-action buttons
- ⭐ Feature showcase grid

## 📚 API Examples

### Get All People

```bash
curl http://localhost:8080/api/v2/
```

### Get Specific Person

```bash
curl http://localhost:8080/api/v2/people/1
```

### Check API Health

```bash
curl http://localhost:8080/api/v2/health
```

## 🔄 CLI Commands

```bash
# Run the server
node cli run

# Show configuration
node cli show

# Validate configuration
node cli validate

# Change environment
node cli env --instance=production --port=3000

# Initialize new config
node cli init

# Show version
node cli version
```

## 🌟 Features Demonstrated

- ✅ **APIManager** - Simplified API requests with retry logic
- ✅ **Modern UI** - Beautiful landing page
- ✅ **Error Handling** - asyncHandler for clean error management
- ✅ **Configuration** - JSON-based config with validation
- ✅ **Health Checks** - Built-in health endpoints
- ✅ **Logging** - Winston logger integration
- ✅ **Security** - Helmet and rate limiting

## 📖 Learn More

- [Full Documentation](https://github.com/misterzik/Espresso.js)
- [Multiple APIs Guide](../docs/MULTIPLE-APIS.md)
- [npm Package](https://www.npmjs.com/package/@misterzik/espressojs)

## 🆘 Troubleshooting

### Port Already in Use

```bash
# Change the port in config.json
node cli env --port=3000
```

### API Not Loading

Make sure `api.enabled` is set to `true` in `config.json`.

### Module Not Found

```bash
npm install
```

## 💡 Next Steps

1. **Customize the UI** - Edit `public/index.html`
2. **Add Your APIs** - Update `config.json` with your endpoints
3. **Create Routes** - Add more routes in `espresso.js`
4. **Enable MongoDB** - Set `mongoDB.enabled` to `true`
5. **Deploy** - Use the production configuration

## 🎯 Production Ready

This demo is production-ready with:
- Security headers (Helmet)
- Rate limiting
- Error handling
- Logging
- Health checks
- Graceful shutdown

Happy coding with EspressoJS! ☕
