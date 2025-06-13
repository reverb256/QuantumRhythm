# GitHub Best Practices for VibeCoding Projects

## Repository Setup and Organization

### Repository Structure
```
portfolio/
├── client/                 # Frontend React application
├── server/                 # Backend Express server (if needed)
├── shared/                 # Shared types and utilities
├── public/                 # Static assets
├── docs/                   # Documentation files
├── .github/                # GitHub workflows and templates
├── README.md               # Project overview
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
├── CONTRIBUTING.md         # Contribution guidelines
└── package.json           # Dependencies and scripts
```

### Branch Strategy

#### Main Branch Protection
- **Protected Branch**: `main` branch requires pull request reviews
- **Status Checks**: All CI checks must pass before merging
- **Linear History**: Enforce merge commits for audit trail
- **Admin Enforcement**: Include administrators in branch protection

#### Feature Branch Workflow
```bash
# Create feature branch
git checkout -b feature/performance-optimization

# Work on changes with descriptive commits
git commit -m "feat: add GPU acceleration for 60fps animations"

# Push and create pull request
git push origin feature/performance-optimization
```

### Commit Message Standards

#### Conventional Commits Format
```
type(scope): description

body (optional)

footer (optional)
```

#### Commit Types
- **feat**: New features or enhancements
- **fix**: Bug fixes and corrections
- **perf**: Performance improvements
- **docs**: Documentation updates
- **style**: Code formatting and styling
- **refactor**: Code restructuring without feature changes
- **test**: Test additions or modifications
- **ci**: CI/CD pipeline changes

#### Examples
```bash
git commit -m "feat(tooltips): add tech humor programming jokes"
git commit -m "perf(animations): optimize for 60fps GitHub Pages deployment"
git commit -m "fix(gaming): update VRChat hours with authentic Steam data"
git commit -m "docs(readme): add deployment guide for Cloudflare CDN"
```

## GitHub Actions Workflows

### Continuous Integration
```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Lighthouse CI
      run: npm run lighthouse:ci
```

### GitHub Pages Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './dist'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### Performance Monitoring
```yaml
# .github/workflows/performance.yml
name: Performance Monitoring

on:
  pull_request:
    branches: [ main ]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        configPath: './lighthouse.config.js'
        uploadArtifacts: true
        temporaryPublicStorage: true
```

## Issue and Pull Request Templates

### Issue Template
```markdown
<!-- .github/ISSUE_TEMPLATE/bug_report.md -->
---
name: Bug Report
about: Create a report to help improve the portfolio
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
Description of expected behavior.

## Screenshots
Add screenshots if applicable.

## Environment
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

## Performance Impact
- [ ] Affects 60fps animations
- [ ] Impacts loading times
- [ ] Breaks mobile experience
- [ ] Accessibility concern

## VibeCoding Compliance
- [ ] Affects philosophical consistency
- [ ] Breaks cyberpunk aesthetics
- [ ] Privacy/security concern
- [ ] Democratic values impact
```

### Pull Request Template
```markdown
<!-- .github/pull_request_template.md -->
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature causing existing functionality change)
- [ ] Documentation update
- [ ] Performance improvement

## VibeCoding Checklist
- [ ] Changes align with classical wisdom principles
- [ ] Maintains cyberpunk aesthetic consistency
- [ ] Preserves 60fps performance targets
- [ ] Respects democratic values and privacy
- [ ] Includes authentic data (no mock/placeholder data)

## Performance Impact
- [ ] Lighthouse score maintained/improved
- [ ] 60fps animations verified
- [ ] Bundle size impact assessed
- [ ] Mobile performance tested

## Testing
- [ ] Tests pass locally
- [ ] Cross-browser compatibility verified
- [ ] Accessibility tested
- [ ] Performance benchmarks run

## Screenshots
Add screenshots of changes if applicable.

## Related Issues
Fixes #(issue number)
```

## Security Best Practices

### Repository Security
- **Dependabot**: Enable automatic security updates
- **Secret Scanning**: Monitor for exposed API keys
- **Vulnerability Alerts**: Enable security advisories
- **Code Scanning**: Use CodeQL for static analysis

### Secrets Management
```yaml
# Proper secrets usage in workflows
- name: Deploy to production
  env:
    API_KEY: ${{ secrets.API_KEY }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: npm run deploy
```

### Security Headers
```javascript
// Implement in deployment
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## Documentation Standards

### README Requirements
- **Clear project description** with authentic data
- **Installation instructions** for local development
- **Deployment guide** for GitHub Pages + Cloudflare
- **Performance metrics** and optimization details
- **VibeCoding methodology** compliance information

### Code Documentation
```typescript
/**
 * Gaming experience component showcasing authentic VR research data
 * Optimized for 60fps performance with GPU acceleration
 * 
 * @param experience - Gaming experience data from Steam/VRChat analytics
 * @returns JSX element with cyberpunk styling and tech humor tooltips
 */
export function GamingExperience({ experience }: GamingExperienceProps) {
  // Implementation with authentic data
}
```

### API Documentation
```typescript
/**
 * Project data interface for portfolio showcase
 * All data sourced from authentic production deployments
 */
interface Project {
  title: string;           // Authentic project name
  technologies: Tech[];    // Real technologies used
  hours: string;          // Actual development time
  status: ProjectStatus;  // Current deployment status
  metrics: Performance;   // Real performance data
}
```

## Release Management

### Semantic Versioning
- **Major (X.0.0)**: Breaking changes or major features
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes and small improvements

### Release Process
```bash
# Create release branch
git checkout -b release/v1.2.0

# Update version and changelog
npm version minor
git add .
git commit -m "chore: bump version to 1.2.0"

# Merge to main and tag
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags
```

### Changelog Format
```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added
- Tech humor tooltips with programming jokes
- 60fps GPU acceleration for all animations
- Authentic VRChat hours from Steam profile data

### Changed
- Optimized for GitHub Pages deployment
- Enhanced Cloudflare CDN integration

### Fixed
- Tooltip z-index layering issues
- Animation performance on mobile devices

### Performance
- Lighthouse score improved to 95+
- Bundle size reduced by 15%
- 60fps maintained across all devices
```

## Collaboration Guidelines

### Code Review Standards
- **Performance Impact**: Verify 60fps maintenance
- **Accessibility**: WCAG AAA compliance check
- **VibeCoding Alignment**: Philosophical consistency review
- **Security**: Privacy and democratic values assessment
- **Authentic Data**: No mock/placeholder data verification

### Review Checklist
```markdown
## Code Review Checklist

### Technical Quality
- [ ] Code follows TypeScript best practices
- [ ] Performance optimizations maintained
- [ ] No console.log statements in production
- [ ] Error handling implemented

### VibeCoding Compliance
- [ ] Aligns with classical wisdom principles
- [ ] Maintains cyberpunk aesthetic
- [ ] Respects democratic values
- [ ] Uses authentic data sources

### Performance
- [ ] 60fps animations verified
- [ ] Bundle size impact assessed
- [ ] Mobile performance tested
- [ ] Accessibility maintained
```

## Monitoring and Analytics

### Performance Tracking
- **Lighthouse CI**: Automated performance monitoring
- **Bundle Analyzer**: Track dependency sizes
- **Core Web Vitals**: User experience metrics
- **GitHub Insights**: Repository activity tracking

### Privacy-Respecting Analytics
```javascript
// Privacy-first performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  // Local performance tracking without external services
  const metrics = list.getEntries();
  console.log('Performance metrics:', metrics);
});
```

## Backup and Recovery

### Repository Backup
- **Multiple Remotes**: GitHub + GitLab mirrors
- **Local Backups**: Regular git bundle creation
- **Documentation Backup**: External documentation storage
- **Asset Backup**: CDN and local asset copies

### Recovery Procedures
```bash
# Create repository backup
git bundle create portfolio-backup.bundle --all

# Restore from backup
git clone portfolio-backup.bundle restored-portfolio
cd restored-portfolio
git remote add origin [new-repo-url]
git push origin --all
```

This comprehensive GitHub best practices guide ensures the portfolio maintains high standards for development, deployment, security, and collaboration while adhering to VibeCoding methodology principles.