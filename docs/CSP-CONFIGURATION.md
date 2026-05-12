# Content Security Policy (CSP) Configuration

This guide explains how to configure Content Security Policy in Espresso.js v4.0.0 to meet your specific security needs.

## 🔒 Default Behavior

By default, Espresso.js applies a **moderate CSP** that balances security and usability:

**Development Mode:**
- Allows `'unsafe-inline'` for styles and scripts
- Allows images from any HTTPS source
- Allows fonts from HTTPS and data URIs

**Production Mode (strictCSP: true):**
- Blocks `'unsafe-inline'` for styles and scripts
- Enforces stricter policies
- Upgrades insecure requests to HTTPS

## ⚙️ Configuration Options

### Option 1: Use Default CSP (Recommended)

```json
{
  "security": {
    "strictCSP": false
  }
}
```

### Option 2: Enable Strict CSP

```json
{
  "security": {
    "strictCSP": true
  }
}
```

**Effect:** Removes `'unsafe-inline'` from styles and scripts, enforces stricter policies.

### Option 3: Completely Disable CSP

For applications that need to load assets from multiple domains or have complex CSP requirements:

```json
{
  "security": {
    "disableCSP": true
  }
}
```

**⚠️ Warning:** Only disable CSP if you understand the security implications!

### Option 4: Custom CSP Directives

For fine-grained control, provide your own CSP directives:

```json
{
  "security": {
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "styleSrc": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "scriptSrc": ["'self'", "https://cdn.example.com"],
      "imgSrc": ["'self'", "data:", "https:", "https://images.example.com"],
      "fontSrc": ["'self'", "https://fonts.gstatic.com"],
      "connectSrc": ["'self'", "https://api.example.com"],
      "frameSrc": ["'none'"],
      "objectSrc": ["'none'"]
    }
  }
}
```

### Option 5: Advanced Helmet Configuration

For complete control over all Helmet options:

```json
{
  "security": {
    "helmet": {
      "hsts": {
        "maxAge": 31536000,
        "includeSubDomains": true,
        "preload": true
      },
      "referrerPolicy": {
        "policy": "no-referrer"
      },
      "noSniff": true
    }
  }
}
```

## 📚 Common Use Cases

### Use Case 1: Loading Assets from CDN

**Problem:** Need to load CSS, JS, and fonts from a CDN.

**Solution:**
```json
{
  "security": {
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "styleSrc": ["'self'", "https://cdn.jsdelivr.net"],
      "scriptSrc": ["'self'", "https://cdn.jsdelivr.net"],
      "fontSrc": ["'self'", "https://cdn.jsdelivr.net"],
      "imgSrc": ["'self'", "data:", "https:"]
    }
  }
}
```

### Use Case 2: Using Google Fonts

**Problem:** Need to load Google Fonts.

**Solution:**
```json
{
  "security": {
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "styleSrc": ["'self'", "https://fonts.googleapis.com"],
      "fontSrc": ["'self'", "https://fonts.gstatic.com"],
      "imgSrc": ["'self'", "data:", "https:"]
    }
  }
}
```

### Use Case 3: Embedding External Content

**Problem:** Need to embed YouTube videos or external iframes.

**Solution:**
```json
{
  "security": {
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "frameSrc": ["'self'", "https://www.youtube.com", "https://player.vimeo.com"],
      "imgSrc": ["'self'", "data:", "https:"]
    }
  }
}
```

### Use Case 4: Using Inline Scripts (Not Recommended)

**Problem:** Legacy code requires inline scripts.

**Solution:**
```json
{
  "security": {
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "scriptSrc": ["'self'", "'unsafe-inline'"],
      "styleSrc": ["'self'", "'unsafe-inline'"]
    }
  }
}
```

**⚠️ Better Solution:** Use nonces or hashes instead of `'unsafe-inline'`.

### Use Case 5: API Connections to External Services

**Problem:** Need to make API calls to external services.

**Solution:**
```json
{
  "security": {
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "connectSrc": [
        "'self'",
        "https://api.stripe.com",
        "https://api.example.com",
        "wss://websocket.example.com"
      ]
    }
  }
}
```

### Use Case 6: Development with Hot Reload

**Problem:** Development server with hot reload needs relaxed CSP.

**Solution:**
```json
{
  "security": {
    "strictCSP": false,
    "cspDirectives": {
      "defaultSrc": ["'self'"],
      "scriptSrc": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "styleSrc": ["'self'", "'unsafe-inline'"],
      "connectSrc": ["'self'", "ws:", "wss:"]
    }
  }
}
```

## 🛡️ CSP Directives Reference

| Directive | Purpose | Example |
|-----------|---------|---------|
| `defaultSrc` | Fallback for all other directives | `["'self'"]` |
| `scriptSrc` | JavaScript sources | `["'self'", "https://cdn.example.com"]` |
| `styleSrc` | CSS sources | `["'self'", "'unsafe-inline'"]` |
| `imgSrc` | Image sources | `["'self'", "data:", "https:"]` |
| `fontSrc` | Font sources | `["'self'", "https://fonts.gstatic.com"]` |
| `connectSrc` | AJAX, WebSocket, EventSource | `["'self'", "https://api.example.com"]` |
| `frameSrc` | iframe sources | `["'none'"]` or `["https://youtube.com"]` |
| `objectSrc` | `<object>`, `<embed>`, `<applet>` | `["'none'"]` |
| `mediaSrc` | `<audio>`, `<video>` | `["'self'", "https://media.example.com"]` |
| `manifestSrc` | Web app manifest | `["'self'"]` |
| `workerSrc` | Web Workers, Service Workers | `["'self'"]` |

## 🔍 Testing Your CSP

### Browser Console

Check browser console for CSP violations:
```
Content Security Policy: The page's settings blocked the loading of a resource at https://example.com/script.js
```

### CSP Report-Only Mode

Test CSP without blocking (requires custom implementation):
```json
{
  "security": {
    "helmet": {
      "contentSecurityPolicy": {
        "reportOnly": true
      }
    }
  }
}
```

### Online Tools

- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Report URI](https://report-uri.com/home/generate)

## 🚨 Common Errors and Solutions

### Error: "Refused to load the stylesheet"

**Cause:** CSS file blocked by CSP.

**Solution:** Add the domain to `styleSrc`:
```json
"styleSrc": ["'self'", "https://cdn.example.com"]
```

### Error: "Refused to execute inline script"

**Cause:** Inline scripts blocked by strict CSP.

**Solutions:**
1. Move scripts to external files
2. Use `'unsafe-inline'` (not recommended)
3. Use nonces or hashes

### Error: "Refused to connect to"

**Cause:** API endpoint blocked by CSP.

**Solution:** Add to `connectSrc`:
```json
"connectSrc": ["'self'", "https://api.example.com"]
```

### Error: "Refused to frame"

**Cause:** iframe blocked by CSP.

**Solution:** Add to `frameSrc`:
```json
"frameSrc": ["'self'", "https://trusted-site.com"]
```

## 📖 Best Practices

1. **Start Strict, Relax as Needed**
   - Begin with strict CSP
   - Add exceptions only when necessary

2. **Use Specific Domains**
   - Avoid wildcards like `https:` when possible
   - Specify exact domains: `https://cdn.example.com`

3. **Avoid 'unsafe-inline' and 'unsafe-eval'**
   - Use external files instead
   - Use nonces or hashes for inline scripts

4. **Test in Development**
   - Use browser console to catch violations
   - Test all features before production

5. **Document Your CSP**
   - Comment why each directive is needed
   - Keep track of external dependencies

6. **Monitor CSP Violations**
   - Set up CSP reporting
   - Review violations regularly

## 🔗 Additional Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [CSP Quick Reference](https://content-security-policy.com/)

## 💡 Pro Tips

- Use `strictCSP: false` in development for easier debugging
- Enable `strictCSP: true` in production for better security
- Test your CSP with browser DevTools
- Use CSP reporting to catch violations in production
- Review and update CSP when adding new external dependencies

---

**Need Help?** Check the [Security Guide](./SECURITY.md) or open an issue on GitHub.
