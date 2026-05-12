# GitHub Actions Workflows

This directory contains automated workflows for Espresso.js CI/CD pipeline.

## 📋 Available Workflows

### 1. **CI Workflow** (`ci.yml`)

**Triggers:**
- Pull requests to `main` or `master` branch
- Pushes to `development` or `dev` branch

**Purpose:** Runs comprehensive tests and checks before code is merged.

**Jobs:**

#### 🧪 Test
- Runs on Node.js 18.x, 20.x, and 22.x
- Executes `npm test`
- Checks for security vulnerabilities
- **Status:** Required to pass

#### 🔍 Lint
- Validates configuration files
- Checks package.json validity
- Reports outdated dependencies
- **Status:** Required to pass

#### 🏗️ Build
- Verifies package can be built
- Checks package size
- Runs `npm pack --dry-run`
- **Status:** Required to pass

#### 🛡️ Security
- Runs `npm audit`
- Fails on critical vulnerabilities
- Warns on high vulnerabilities
- **Status:** Required to pass (no critical vulnerabilities)

#### 💻 Compatibility
- Tests on Ubuntu, Windows, and macOS
- Ensures cross-platform compatibility
- Tests CLI commands
- **Status:** Required to pass

#### 📋 PR Info
- Shows PR metadata
- Lists changed files
- Displays commit messages
- **Status:** Informational only

#### 📊 Summary
- Aggregates all job results
- Provides final pass/fail status
- **Status:** Final check

---

### 2. **NPM Publish Workflow** (`npm-publish.yml`)

**Triggers:**
- GitHub release is created

**Purpose:** Automatically publishes package to npm and GitHub Packages.

**Jobs:**

#### 🧪 Build
- Runs tests before publishing
- Ensures code quality
- **Status:** Required to pass

#### 📦 Publish to npm
- Publishes to npmjs.org
- Requires `npm_token` secret
- **Status:** Runs after build passes

#### 📦 Publish to GitHub Packages
- Publishes to GitHub Package Registry
- Uses `GITHUB_TOKEN` automatically
- **Status:** Runs after build passes

---

## 🔧 Setup Requirements

### Required Secrets

Configure these in GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

1. **`npm_token`** (Required for npm publishing)
   - Get from: https://www.npmjs.com/settings/[username]/tokens
   - Type: Automation token
   - Scope: Publish

2. **`GITHUB_TOKEN`** (Automatically provided)
   - No setup needed
   - Used for GitHub Packages

### Branch Protection Rules

Recommended settings for `main` branch:

```
Settings → Branches → Branch protection rules → Add rule

Branch name pattern: main

✅ Require a pull request before merging
   ✅ Require approvals: 1
   ✅ Dismiss stale pull request approvals when new commits are pushed

✅ Require status checks to pass before merging
   ✅ Require branches to be up to date before merging
   Required status checks:
      - Test on Node.js 18.x
      - Test on Node.js 20.x
      - Test on Node.js 22.x
      - Code Quality Checks
      - Build Check
      - Security Scan
      - Compatibility Check (ubuntu-latest)

✅ Require conversation resolution before merging
✅ Do not allow bypassing the above settings
```

---

## 🚀 Usage

### For Developers

#### Creating a Pull Request

1. **Create feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/my-feature
   ```

3. **Create PR on GitHub:**
   - Go to repository → Pull requests → New pull request
   - Base: `main` ← Compare: `feature/my-feature`
   - Click "Create pull request"

4. **CI automatically runs:**
   - All checks must pass before merge
   - Review any failures and fix
   - Push fixes to the same branch

5. **Merge when ready:**
   - All checks green ✅
   - Approved by reviewer
   - Click "Merge pull request"

#### Pushing to Development

```bash
git checkout development
git pull origin development
git merge feature/my-feature
git push origin development
```

CI runs automatically on push to `development`.

---

### For Maintainers

#### Publishing a Release

1. **Ensure main branch is ready:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Update version:**
   ```bash
   npm version patch  # 4.0.0 → 4.0.1
   npm version minor  # 4.0.0 → 4.1.0
   npm version major  # 4.0.0 → 5.0.0
   ```

3. **Push changes and tag:**
   ```bash
   git push origin main
   git push origin v4.0.1
   ```

4. **Create GitHub Release:**
   - Go to repository → Releases → Create new release
   - Choose tag: `v4.0.1`
   - Title: `v4.0.1`
   - Description: Copy from CHANGELOG.md
   - Click "Publish release"

5. **NPM Publish workflow runs automatically:**
   - Runs tests
   - Publishes to npm
   - Publishes to GitHub Packages

---

## 📊 Workflow Status

### Viewing Workflow Runs

1. Go to repository → Actions tab
2. Select workflow (CI or NPM Publish)
3. Click on a specific run to see details

### Understanding Status Badges

Add to README.md:

```markdown
![CI](https://github.com/misterzik/Espresso.js/workflows/CI/badge.svg)
![NPM Publish](https://github.com/misterzik/Espresso.js/workflows/NPM%20Publish/badge.svg)
```

### Status Indicators

- ✅ **Success** - All checks passed
- ❌ **Failure** - One or more checks failed
- 🟡 **Pending** - Workflow is running
- ⚪ **Skipped** - Job was skipped

---

## 🐛 Troubleshooting

### CI Workflow Fails

#### Test Job Fails
```bash
# Run tests locally
npm test

# Fix any failing tests
# Push changes
git push
```

#### Security Job Fails
```bash
# Check vulnerabilities
npm audit

# Fix critical vulnerabilities
npm audit fix

# Or update specific packages
npm update package-name
```

#### Compatibility Job Fails
```bash
# Test on specific OS
# Use GitHub Actions or local VM

# Common issues:
# - Path separators (use path.join)
# - Line endings (configure .gitattributes)
# - Case-sensitive file systems
```

### NPM Publish Workflow Fails

#### Build Job Fails
- Same as CI workflow test failures
- Fix tests and create new release

#### Publish Job Fails
```
Error: You do not have permission to publish
```

**Solution:** Check npm token:
1. Verify token in GitHub secrets
2. Ensure token has publish permissions
3. Check if you're a maintainer of the package

```
Error: Package already exists
```

**Solution:** Version already published:
1. Update version in package.json
2. Create new tag and release

---

## 🔄 Workflow Customization

### Changing Node.js Versions

Edit `ci.yml`:
```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]  # Add or remove versions
```

### Adding New Checks

Add a new job in `ci.yml`:
```yaml
my-custom-check:
  name: My Custom Check
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm run my-custom-script
```

### Disabling Specific Jobs

Comment out or remove the job from the workflow file.

---

## 📚 Best Practices

1. **Always run tests locally before pushing**
   ```bash
   npm test
   ```

2. **Keep workflows fast**
   - Use caching
   - Run jobs in parallel
   - Skip unnecessary steps

3. **Monitor workflow usage**
   - GitHub Actions has usage limits
   - Check Settings → Billing

4. **Use semantic commit messages**
   ```
   feat: add new feature
   fix: fix bug
   docs: update documentation
   chore: update dependencies
   ```

5. **Review workflow logs**
   - Check for warnings
   - Optimize slow steps
   - Fix flaky tests

---

## 🔗 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Publishing to npm](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
- [Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)

---

## 💡 Tips

- **Use draft PRs** for work in progress
- **Enable auto-merge** when all checks pass
- **Review workflow runs** regularly
- **Keep dependencies updated** to avoid security issues
- **Test locally** before pushing to save CI minutes

---

**Questions?** Check the main [README.md](../../README.md) or open an issue.
