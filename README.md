# danielvaughan.github.io

Source for **[danielvaughan.com](https://danielvaughan.com)** — Daniel Vaughan's personal website. Built with [Jekyll](https://jekyllrb.com/) and hosted via GitHub Pages.

## What's on the site

### Homepage (`index.md`)

Single-page profile layout with sections:

- **Hero** — title, one-line bio, links to Blog and LinkedIn
- **About** — 25 years experience, focus on AI-native architectures and agentic AI
- **Current Role** — Programme Director, HCLTech AI Labs; agentic software engineering, 2.5-person pod model, Google Cloud / ADK / Vertex AI
- **Books & Recognition** — *Cloud Native Development with Google Cloud* (O'Reilly, 2024); *Ext GWT 2.0: Beginner's Guide* (Packt, 2010); Google Developer Expert; Green Software Champion
- **Community** — Software Crafters Cambridge organiser; Genome Campus Software Community founder; EMBL-EBI Technical Seminars Programme founder
- **Connect** — LinkedIn and Blog links

### Pages

| File | URL | Description |
|------|-----|-------------|
| `index.md` | `/` | Main profile page |
| `k8s-coffee.md` | `/k8s-coffee` | Kubernetes Breakfast Coffee — informal monthly meetup, second Wednesday, 8–9am, Joe and the Juice, Bishopsgate |

### Legacy / archived content

| Directory | Contents |
|-----------|----------|
| `Salisbury/` | Old photo gallery (Panasonic Lumix shots from Salisbury) |
| `gxt-book/` | Example files from the *Ext GWT 2.0* book (XML feeds, sample images) |
| `redundant/` | Old Bootstrap 3 site — HTML, CSS, JS from the previous version |

## Tech stack

- **Generator**: Jekyll (with `jekyll-feed` and `jekyll-sitemap` plugins)
- **CSS**: Bootstrap 4 via SCSS (`_sass/bootstrap/`)
- **Layout**: Custom profile layout (`_layouts/profile.html`)
- **Hosting**: GitHub Pages at `danielvaughan.com` (CNAME configured)

## Key files

| File | Purpose |
|------|---------|
| `_config.yml` | Site title, URL, plugins, excluded files |
| `_layouts/profile.html` | Main single-page profile layout with navbar |
| `_includes/head.html` | `<head>` — meta, CSS |
| `assets/main.scss` | Entry point for all styles |
| `img/` | Profile photos (`daniel-vaughan-en.jpg` is the current one) |
| `CNAME` | Points GitHub Pages to `danielvaughan.com` |

## Related

- **Blog**: [blog.danielvaughan.com](https://blog.danielvaughan.com)
- **Newsletter**: [danielpvaughan.substack.com](https://danielpvaughan.substack.com) — *Custodian of Intent*
- **LinkedIn**: [linkedin.com/in/danielpvaughan](https://www.linkedin.com/in/danielpvaughan)
- **Obsidian vault**: [github.com/danielvaughan/obsidian-vault](https://github.com/danielvaughan/obsidian-vault)
- **Agent-taming**: [github.com/danielvaughan/agent-taming](https://github.com/danielvaughan/agent-taming)
