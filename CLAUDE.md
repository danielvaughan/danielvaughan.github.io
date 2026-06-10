ple# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub Pages personal website for Daniel Vaughan hosted at danielvaughan.com. The site is built using Jekyll and deployed via GitHub Pages.

## Architecture

### Jekyll Setup
- Uses the `github-pages` gem for GitHub Pages compatibility
- Jekyll plugins enabled: `jekyll-feed` and `jekyll-sitemap`
- Configuration in `_config.yml`

### Layout Structure
- **default.html**: Base layout with container wrapper, includes head and footer
- **home.html**: Extends default, displays page content and lists blog posts if any exist
- **page.html**: Extends default, simple page layout
- **post.html**: For blog posts (though currently no posts in `_posts/`)

The header navigation is currently commented out in `default.html` (line 8).

### Content Organization
- Main content: `index.md` - personal bio and professional information
- Static pages: `k8s-coffee.md`, `korean-emoticons.html`
- Photo gallery: `Salisbury/` directory contains ~70+ HTML files for a photo gallery with pagination (index.html through index5.html)
- Legacy content in `redundant/` directory

### Styling
- Uses Bootstrap 4 via SCSS imports in `_sass/`
- Custom Bootstrap variables and overrides in `_sass/_bootstrap_customization.scss` and `_sass/_variables.scss`
- Syntax highlighting styles in `_sass/_syntax-highlighting.scss`
- Bootstrap JavaScript loaded via `assets/javascript/bootstrap/`

## Development Commands

### Local Development
```bash
bundle install              # Install dependencies
bundle exec jekyll serve    # Run local development server
```

### Updating Bootstrap
```bash
./update_bootstrap.sh       # Update Bootstrap files
```

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the master branch. No manual build or deployment steps required.

## Key Files
- `_config.yml`: Site configuration and metadata
- `index.md`: Main homepage content
- `Gemfile`: Ruby dependencies (uses github-pages gem)
- `sitemap.xml` and `robots.txt`: SEO configuration
- `CNAME`: Domain configuration for danielvaughan.com
## Visual Development

### Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing