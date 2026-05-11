# Security Policy

## Supported Versions

We actively support the following versions of Espresso.js with security updates:

| Version | Supported          | End of Life |
| ------- | ------------------ | ----------- |
| 4.x     | ✅ Yes             | TBD         |
| 3.3.x   | ⚠️ Critical fixes only | 2025-06-01  |
| < 3.3   | ❌ No              | Ended       |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 🔒 Private Disclosure (Preferred)

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues privately:

1. **Email**: security@vimedev.com
2. **Subject**: `[SECURITY] Espresso.js - Brief Description`
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### 📧 Email Template

```
Subject: [SECURITY] Espresso.js - [Brief Description]

**Vulnerability Type**: [e.g., XSS, SQL Injection, etc.]

**Affected Versions**: [e.g., 4.0.0, 3.3.6]

**Description**:
[Detailed description of the vulnerability]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Impact**:
[What can an attacker do with this vulnerability?]

**Suggested Fix** (optional):
[Your recommendation]

**Reporter**: [Your name/handle]
**Contact**: [Your email]
```

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Vulnerability Assessment**: Within 5 business days
- **Fix Development**: Depends on severity (see below)
- **Public Disclosure**: After fix is released (coordinated with reporter)

### 🚨 Severity Levels

| Severity | Response Time | Examples |
|----------|---------------|----------|
| **Critical** | 24-48 hours | Remote code execution, authentication bypass |
| **High** | 3-5 days | SQL injection, XSS, privilege escalation |
| **Medium** | 1-2 weeks | CSRF, information disclosure |
| **Low** | 2-4 weeks | Minor information leaks, DoS |

## Security Update Process

1. **Acknowledgment**: We confirm receipt of your report
2. **Investigation**: We verify and assess the vulnerability
3. **Fix Development**: We develop and test a patch
4. **Coordinated Disclosure**: We work with you on disclosure timing
5. **Release**: We release a security patch
6. **Advisory**: We publish a security advisory
7. **Credit**: We credit you in the advisory (if desired)

## Security Advisories

Security advisories are published on:
- GitHub Security Advisories: https://github.com/misterzik/Espresso.js/security/advisories
- npm Advisory Database
- CHANGELOG.md with `[SECURITY]` tag

## Bug Bounty Program

Currently, we do not have a formal bug bounty program. However:
- We acknowledge security researchers in our CHANGELOG
- We provide credit in security advisories
- We may offer rewards for critical vulnerabilities on a case-by-case basis

## Security Best Practices

For developers using Espresso.js, please refer to:
- [Security Best Practices Guide](./docs/SECURITY.md)
- [Configuration Security](./docs/SECURITY.md#production-checklist)
- [Migration Guide](./MIGRATION-V4.md)

## What We Do

### Regular Security Measures

- ✅ Regular dependency updates
- ✅ Automated security scanning (npm audit)
- ✅ Code review for security issues
- ✅ Security-focused testing
- ✅ Prompt response to vulnerability reports

### Security Features

Espresso.js v4.0.0 includes:
- Helmet.js for secure HTTP headers
- express-mongo-sanitize for NoSQL injection prevention
- hpp for HTTP Parameter Pollution protection
- express-rate-limit for DDoS protection
- Input validation with express-validator
- Secure credential handling

See [docs/SECURITY.md](./docs/SECURITY.md) for detailed information.

## Scope

### In Scope

Security issues in:
- Espresso.js core framework
- Built-in middleware
- Configuration handling
- Authentication/authorization helpers
- API enhancements
- SSR implementation

### Out of Scope

- Third-party dependencies (report to respective maintainers)
- User application code
- Deployment infrastructure
- Social engineering attacks
- Physical security

## Disclosure Policy

We follow **coordinated disclosure**:

1. Reporter notifies us privately
2. We confirm and investigate
3. We develop a fix
4. We coordinate disclosure timing with reporter
5. We release the fix
6. We publish advisory (typically 7 days after fix)

We request that reporters:
- Give us reasonable time to fix the issue
- Do not publicly disclose until we release a fix
- Do not exploit the vulnerability

## Past Security Issues

We maintain transparency about past security issues:

### v4.0.0 (Current)
- No known security vulnerabilities

### v3.x
- **[FIXED]** MongoDB credential exposure in connection string (v4.0.0)
- **[FIXED]** Weak CSP with unsafe-inline (v4.0.0)
- **[FIXED]** No NoSQL injection prevention (v4.0.0)

See [CHANGELOG.md](./CHANGELOG.md) for complete history.

## Security Contacts

- **Primary**: security@vimedev.com
- **GitHub**: @misterzik
- **Issues**: https://github.com/misterzik/Espresso.js/issues (for non-security bugs only)

## Acknowledgments

We thank the following security researchers for responsible disclosure:

- [Your name could be here!]

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [npm Security Advisories](https://www.npmjs.com/advisories)

## Legal

By reporting a security vulnerability, you agree to:
- Act in good faith
- Not exploit the vulnerability beyond what's necessary to demonstrate it
- Keep the vulnerability confidential until we release a fix
- Not demand payment or rewards

We commit to:
- Respond promptly to your report
- Keep you informed of our progress
- Credit you in the security advisory (if desired)
- Not take legal action against good-faith security research

---

**Last Updated**: January 15, 2024  
**Version**: 4.0.0  
**Contact**: security@vimedev.com
