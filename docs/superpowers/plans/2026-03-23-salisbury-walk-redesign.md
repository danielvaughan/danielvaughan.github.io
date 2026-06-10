# Salisbury Walk Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform a 2002 photo gallery of 72 walking photos into an interactive scrolling story with a Leaflet route map and Google Street View "then vs now" comparisons.

**Architecture:** Jekyll page with a new container-free layout. All 72 photos rendered from a YAML data file. Two-column layout: scrolling photo cards on the left, sticky Leaflet map on the right. Intersection Observer tracks scroll position to update the map marker. Street View embeds appear side-by-side with original photos at key comparison points.

**Tech Stack:** Jekyll, Bootstrap 4 (existing), Leaflet + OpenStreetMap (CDN), Google Maps Embed API, vanilla JS (Intersection Observer)

**Spec:** `docs/superpowers/specs/2026-03-23-salisbury-walk-redesign-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `_data/salisbury_walk.yml` | Create | Photo metadata, route coordinates, Street View params |
| `_layouts/salisbury-walk.html` | Create | Container-free layout (includes head.html + footer.html) |
| `salisbury-walk/index.html` | Create | Main page: hero, two-column grid, photo cards, map, JS |
| `_config.yml` | Modify | Add `docs/` to exclude list, add `google_maps_api_key` |

All CSS is scoped inline or in a `<style>` block within the page (no separate CSS file — keeps it self-contained and avoids Jekyll asset pipeline complexity). All JS is in a `<script>` block at the bottom of the page.

Photos are referenced from the existing `Salisbury/` directory — no files are copied.

---

### Task 1: Create the photo data file

**Files:**
- Create: `_data/salisbury_walk.yml`

- [ ] **Step 1: Create `_data/` directory**

```bash
mkdir -p _data
```

- [ ] **Step 2: Create `_data/salisbury_walk.yml` with all 72 photo entries**

The file must enumerate every actual photo on disk. Portrait photos (480x640): PA180001–PA180006, PA180033. All others are landscape (640x480). PA180072–PA180073 do not exist.

```yaml
title: "A Walk Around Salisbury"
date: "October 2002"

route:
  # Placeholder coordinates — to be refined in Phase 2 with user
  coordinates:
    - [51.0740, -1.7950]
    - [51.0730, -1.7940]
    - [51.0720, -1.7935]
    - [51.0710, -1.7930]
    - [51.0700, -1.7925]
    - [51.0690, -1.7920]

photos:
  - id: "PA180001"
    location: ""
    orientation: "portrait"
    alt: "Photo 1 of walk around Salisbury"
    comparison: false

  - id: "PA180002"
    location: ""
    orientation: "portrait"
    alt: "Photo 2 of walk around Salisbury"
    comparison: false

  - id: "PA180003"
    location: ""
    orientation: "portrait"
    alt: "Photo 3 of walk around Salisbury"
    comparison: false

  - id: "PA180004"
    location: ""
    orientation: "portrait"
    alt: "Photo 4 of walk around Salisbury"
    comparison: false

  - id: "PA180005"
    location: ""
    orientation: "portrait"
    alt: "Photo 5 of walk around Salisbury"
    comparison: false

  - id: "PA180006"
    location: ""
    orientation: "portrait"
    alt: "Photo 6 of walk around Salisbury"
    comparison: false

  - id: "PA180007"
    location: ""
    orientation: "landscape"
    alt: "Photo 7 of walk around Salisbury"
    comparison: false

  - id: "PA180008"
    location: ""
    orientation: "landscape"
    alt: "Photo 8 of walk around Salisbury"
    comparison: false

  - id: "PA180009"
    location: ""
    orientation: "landscape"
    alt: "Photo 9 of walk around Salisbury"
    comparison: false

  - id: "PA180010"
    location: ""
    orientation: "landscape"
    alt: "Photo 10 of walk around Salisbury"
    comparison: false

  - id: "PA180011"
    location: ""
    orientation: "landscape"
    alt: "Photo 11 of walk around Salisbury"
    comparison: false

  - id: "PA180012"
    location: ""
    orientation: "landscape"
    alt: "Photo 12 of walk around Salisbury"
    comparison: false

  - id: "PA180013"
    location: ""
    orientation: "landscape"
    alt: "Photo 13 of walk around Salisbury"
    comparison: false

  - id: "PA180014"
    location: ""
    orientation: "landscape"
    alt: "Photo 14 of walk around Salisbury"
    comparison: false

  - id: "PA180015"
    location: ""
    orientation: "landscape"
    alt: "Photo 15 of walk around Salisbury"
    comparison: false

  - id: "PA180016"
    location: ""
    orientation: "landscape"
    alt: "Photo 16 of walk around Salisbury"
    comparison: false

  - id: "PA180017"
    location: ""
    orientation: "landscape"
    alt: "Photo 17 of walk around Salisbury"
    comparison: false

  - id: "PA180018"
    location: ""
    orientation: "landscape"
    alt: "Photo 18 of walk around Salisbury"
    comparison: false

  - id: "PA180019"
    location: ""
    orientation: "landscape"
    alt: "Photo 19 of walk around Salisbury"
    comparison: false

  - id: "PA180020"
    location: ""
    orientation: "landscape"
    alt: "Photo 20 of walk around Salisbury"
    comparison: false

  - id: "PA180021"
    location: ""
    orientation: "landscape"
    alt: "Photo 21 of walk around Salisbury"
    comparison: false

  - id: "PA180022"
    location: ""
    orientation: "landscape"
    alt: "Photo 22 of walk around Salisbury"
    comparison: false

  - id: "PA180023"
    location: ""
    orientation: "landscape"
    alt: "Photo 23 of walk around Salisbury"
    comparison: false

  - id: "PA180024"
    location: ""
    orientation: "landscape"
    alt: "Photo 24 of walk around Salisbury"
    comparison: false

  - id: "PA180025"
    location: ""
    orientation: "landscape"
    alt: "Photo 25 of walk around Salisbury"
    comparison: false

  - id: "PA180026"
    location: ""
    orientation: "landscape"
    alt: "Photo 26 of walk around Salisbury"
    comparison: false

  - id: "PA180027"
    location: ""
    orientation: "landscape"
    alt: "Photo 27 of walk around Salisbury"
    comparison: false

  - id: "PA180028"
    location: ""
    orientation: "landscape"
    alt: "Photo 28 of walk around Salisbury"
    comparison: false

  - id: "PA180029"
    location: ""
    orientation: "landscape"
    alt: "Photo 29 of walk around Salisbury"
    comparison: false

  - id: "PA180030"
    location: ""
    orientation: "landscape"
    alt: "Photo 30 of walk around Salisbury"
    comparison: false

  - id: "PA180031"
    location: ""
    orientation: "landscape"
    alt: "Photo 31 of walk around Salisbury"
    comparison: false

  - id: "PA180032"
    location: ""
    orientation: "landscape"
    alt: "Photo 32 of walk around Salisbury"
    comparison: false

  - id: "PA180033"
    location: ""
    orientation: "portrait"
    alt: "Photo 33 of walk around Salisbury"
    comparison: false

  - id: "PA180034"
    location: ""
    orientation: "landscape"
    alt: "Photo 34 of walk around Salisbury"
    comparison: false

  - id: "PA180035"
    location: ""
    orientation: "landscape"
    alt: "Photo 35 of walk around Salisbury"
    comparison: false

  - id: "PA180036"
    location: ""
    orientation: "landscape"
    alt: "Photo 36 of walk around Salisbury"
    comparison: false

  - id: "PA180037"
    location: ""
    orientation: "landscape"
    alt: "Photo 37 of walk around Salisbury"
    comparison: false

  - id: "PA180038"
    location: ""
    orientation: "landscape"
    alt: "Photo 38 of walk around Salisbury"
    comparison: false

  - id: "PA180039"
    location: ""
    orientation: "landscape"
    alt: "Photo 39 of walk around Salisbury"
    comparison: false

  - id: "PA180040"
    location: ""
    orientation: "landscape"
    alt: "Photo 40 of walk around Salisbury"
    comparison: false

  - id: "PA180041"
    location: ""
    orientation: "landscape"
    alt: "Photo 41 of walk around Salisbury"
    comparison: false

  - id: "PA180042"
    location: ""
    orientation: "landscape"
    alt: "Photo 42 of walk around Salisbury"
    comparison: false

  - id: "PA180043"
    location: ""
    orientation: "landscape"
    alt: "Photo 43 of walk around Salisbury"
    comparison: false

  - id: "PA180044"
    location: ""
    orientation: "landscape"
    alt: "Photo 44 of walk around Salisbury"
    comparison: false

  - id: "PA180045"
    location: ""
    orientation: "landscape"
    alt: "Photo 45 of walk around Salisbury"
    comparison: false

  - id: "PA180046"
    location: ""
    orientation: "landscape"
    alt: "Photo 46 of walk around Salisbury"
    comparison: false

  - id: "PA180047"
    location: ""
    orientation: "landscape"
    alt: "Photo 47 of walk around Salisbury"
    comparison: false

  - id: "PA180048"
    location: ""
    orientation: "landscape"
    alt: "Photo 48 of walk around Salisbury"
    comparison: false

  - id: "PA180049"
    location: ""
    orientation: "landscape"
    alt: "Photo 49 of walk around Salisbury"
    comparison: false

  - id: "PA180050"
    location: ""
    orientation: "landscape"
    alt: "Photo 50 of walk around Salisbury"
    comparison: false

  - id: "PA180051"
    location: ""
    orientation: "landscape"
    alt: "Photo 51 of walk around Salisbury"
    comparison: false

  - id: "PA180052"
    location: ""
    orientation: "landscape"
    alt: "Photo 52 of walk around Salisbury"
    comparison: false

  - id: "PA180053"
    location: ""
    orientation: "landscape"
    alt: "Photo 53 of walk around Salisbury"
    comparison: false

  - id: "PA180054"
    location: ""
    orientation: "landscape"
    alt: "Photo 54 of walk around Salisbury"
    comparison: false

  - id: "PA180055"
    location: ""
    orientation: "landscape"
    alt: "Photo 55 of walk around Salisbury"
    comparison: false

  - id: "PA180056"
    location: ""
    orientation: "landscape"
    alt: "Photo 56 of walk around Salisbury"
    comparison: false

  - id: "PA180057"
    location: ""
    orientation: "landscape"
    alt: "Photo 57 of walk around Salisbury"
    comparison: false

  - id: "PA180058"
    location: ""
    orientation: "landscape"
    alt: "Photo 58 of walk around Salisbury"
    comparison: false

  - id: "PA180059"
    location: ""
    orientation: "landscape"
    alt: "Photo 59 of walk around Salisbury"
    comparison: false

  - id: "PA180060"
    location: ""
    orientation: "landscape"
    alt: "Photo 60 of walk around Salisbury"
    comparison: false

  - id: "PA180061"
    location: ""
    orientation: "landscape"
    alt: "Photo 61 of walk around Salisbury"
    comparison: false

  - id: "PA180062"
    location: ""
    orientation: "landscape"
    alt: "Photo 62 of walk around Salisbury"
    comparison: false

  - id: "PA180063"
    location: ""
    orientation: "landscape"
    alt: "Photo 63 of walk around Salisbury"
    comparison: false

  - id: "PA180064"
    location: ""
    orientation: "landscape"
    alt: "Photo 64 of walk around Salisbury"
    comparison: false

  - id: "PA180065"
    location: ""
    orientation: "landscape"
    alt: "Photo 65 of walk around Salisbury"
    comparison: false

  - id: "PA180066"
    location: ""
    orientation: "landscape"
    alt: "Photo 66 of walk around Salisbury"
    comparison: false

  - id: "PA180067"
    location: ""
    orientation: "landscape"
    alt: "Photo 67 of walk around Salisbury"
    comparison: false

  - id: "PA180068"
    location: ""
    orientation: "landscape"
    alt: "Photo 68 of walk around Salisbury"
    comparison: false

  - id: "PA180069"
    location: ""
    orientation: "landscape"
    alt: "Photo 69 of walk around Salisbury"
    comparison: false

  - id: "PA180070"
    location: ""
    orientation: "landscape"
    alt: "Photo 70 of walk around Salisbury"
    comparison: false

  - id: "PA180071"
    location: ""
    orientation: "landscape"
    alt: "Photo 71 of walk around Salisbury"
    comparison: false

  - id: "PA180074"
    location: ""
    orientation: "landscape"
    alt: "Photo 72 of walk around Salisbury"
    comparison: false
```

- [ ] **Step 3: Verify the file has exactly 72 photo entries**

Run: `grep "^  - id:" _data/salisbury_walk.yml | wc -l`
Expected: `72`

- [ ] **Step 4: Commit**

```bash
git add _data/salisbury_walk.yml
git commit -m "feat: add Salisbury walk photo data file with all 72 entries"
```

---

### Task 2: Create the container-free layout

**Files:**
- Create: `_layouts/salisbury-walk.html`
- Reference: `_layouts/default.html`, `_includes/head.html`, `_includes/footer.html`

The existing `default.html` layout wraps content in `<div class="container page-content">` which constrains width. This new layout renders content without a wrapper, allowing the page to control its own width.

- [ ] **Step 1: Create directories**

```bash
mkdir -p salisbury-walk
```

- [ ] **Step 2: Create `_layouts/salisbury-walk.html`**

This layout supports an optional `extra_head` block for page-specific CSS/JS in `<head>`, avoiding invalid HTML from `<link>` tags inside `<main>`.

```html
<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang | default: "en" }}">

  {%- include head.html -%}
  {% if page.extra_css %}{% for css in page.extra_css %}<link rel="stylesheet" href="{{ css }}">{% endfor %}{% endif %}

  <body>

    <main>
      {{ content }}
    </main>

    {%- include footer.html -%}

  </body>

</html>
```

- [ ] **Step 3: Verify it renders by creating a temporary test page**

Create `salisbury-walk/index.html` with minimal content:

```html
---
layout: salisbury-walk
title: "A Walk Around Salisbury"
---
<div style="padding: 2rem; text-align: center;">
  <h1>Layout test</h1>
  <p>If this text is full-width (no container constraint), the layout works.</p>
</div>
```

Run: `bundle exec jekyll build 2>&1 | tail -5`
Expected: Build succeeds with no errors. Check `_site/salisbury-walk/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add _layouts/salisbury-walk.html salisbury-walk/index.html
git commit -m "feat: add container-free layout for Salisbury walk page"
```

---

### Task 3: Update `_config.yml`

**Files:**
- Modify: `_config.yml`

- [ ] **Step 1: Add `docs/` to the exclude list and add Google Maps API key placeholder**

Add to the `exclude:` list:
```yaml
  - docs/
```

Add after the `exclude:` block:
```yaml
google_maps_api_key: ""
```

- [ ] **Step 2: Verify Jekyll build still works**

Run: `bundle exec jekyll build 2>&1 | tail -5`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add _config.yml
git commit -m "chore: exclude docs/ from build, add Google Maps API key placeholder"
```

---

### Task 4: Build the main page — hero and two-column grid

**Files:**
- Modify: `salisbury-walk/index.html`

This replaces the test content from Task 2 with the full page structure. The page has three sections: hero, two-column main content (photo list left, sticky map right), and a back link. All CSS is in a scoped `<style>` block. Leaflet is loaded from CDN.

- [ ] **Step 1: Write the full page with hero, grid, and styles**

Replace the contents of `salisbury-walk/index.html` with the full page. The page structure:

```html
---
layout: salisbury-walk
title: "A Walk Around Salisbury"
extra_css:
  - "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
---

<style>
  /* Hero */
  .sw-hero {
    text-align: center;
    padding: 3rem 1rem 2rem;
    border-bottom: 1px solid #e9ecef;
  }
  .sw-hero h1 {
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 0.25rem;
  }
  .sw-hero .sw-subtitle {
    color: #6c757d;
    font-size: 1.1rem;
  }

  /* Main layout */
  .sw-main {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
    gap: 1.5rem;
  }
  .sw-photos {
    flex: 0 0 65%;
    max-width: 65%;
  }
  .sw-map-col {
    flex: 0 0 35%;
    max-width: 35%;
  }
  .sw-map-sticky {
    position: sticky;
    top: 1rem;
    height: calc(100vh - 2rem);
  }
  #salisbury-map {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 1px solid #dee2e6;
  }

  /* Photo cards */
  .sw-card {
    margin-bottom: 1.5rem;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
  }
  .sw-card img {
    width: 100%;
    height: auto;
    display: block;
    max-height: 500px;
    object-fit: contain;
    background: #f8f9fa;
  }
  .sw-card-caption {
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: #6c757d;
  }
  .sw-card-location {
    color: #212529;
    font-weight: 500;
  }

  /* Comparison cards */
  .sw-comparison {
    display: flex;
    gap: 0;
  }
  .sw-comparison-then,
  .sw-comparison-now {
    flex: 1;
    min-width: 0;
  }
  .sw-comparison-then {
    border-right: 2px solid #dee2e6;
  }
  .sw-comparison-then img {
    max-height: 350px;
  }
  .sw-comparison-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.5rem 1rem 0.25rem;
  }
  .sw-label-then { color: #b8860b; }
  .sw-label-now { color: #4a90d9; }
  .sw-streetview-frame {
    width: 100%;
    height: 350px;
    border: none;
  }
  .sw-streetview-placeholder {
    width: 100%;
    height: 350px;
    background: #f0f4f8;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #adb5bd;
    font-size: 0.9rem;
  }

  /* Mobile progress bar */
  .sw-mobile-progress {
    display: none;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
  .sw-progress-bar {
    height: 3px;
    background: #e9ecef;
    border-radius: 2px;
    margin-top: 0.25rem;
  }
  .sw-progress-fill {
    height: 100%;
    background: #212529;
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  /* Back link */
  .sw-back {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid #e9ecef;
  }

  /* Responsive */
  @media (max-width: 991px) {
    .sw-photos { flex: 0 0 70%; max-width: 70%; }
    .sw-map-col { flex: 0 0 30%; max-width: 30%; }
  }
  @media (max-width: 767px) {
    .sw-main {
      flex-direction: column;
      padding: 1rem;
    }
    .sw-photos, .sw-map-col {
      flex: none;
      max-width: 100%;
    }
    .sw-map-col { display: none; }
    .sw-mobile-progress { display: block; }
    .sw-comparison { flex-direction: column; }
    .sw-comparison-then { border-right: none; border-bottom: 2px solid #dee2e6; }
  }
</style>

<!-- Hero -->
<header class="sw-hero" role="banner">
  <h1>{{ site.data.salisbury_walk.title }}</h1>
  <p class="sw-subtitle">{{ site.data.salisbury_walk.date }}</p>
</header>

<!-- Mobile progress bar -->
<div class="sw-mobile-progress" aria-live="polite">
  <span class="sw-progress-location"></span>
  <span class="sw-progress-count"></span>
  <div class="sw-progress-bar">
    <div class="sw-progress-fill" style="width: 0%"></div>
  </div>
</div>

<!-- Main content -->
<div class="sw-main">
  <!-- Photo column -->
  <div class="sw-photos" role="main" aria-label="Photo sequence">
    {% assign total = site.data.salisbury_walk.photos | size %}
    {% for photo in site.data.salisbury_walk.photos %}
      {% assign num = forloop.index %}
      <article class="sw-card" id="photo-{{ photo.id }}" data-index="{{ forloop.index0 }}">
        {% if photo.comparison and photo.streetview %}
          <!-- Comparison card: then vs now -->
          <div class="sw-comparison">
            <div class="sw-comparison-then">
              <div class="sw-comparison-label sw-label-then">2002</div>
              <img
                src="{{ "/Salisbury/" | append: photo.id | append: ".jpg" | relative_url }}"
                alt="{{ photo.alt }}"
                {% if forloop.index <= 3 %}loading="eager"{% else %}loading="lazy"{% endif %}
              >
            </div>
            <div class="sw-comparison-now">
              <div class="sw-comparison-label sw-label-now">Today</div>
              <div
                class="sw-streetview-placeholder"
                data-lat="{{ photo.streetview.lat }}"
                data-lng="{{ photo.streetview.lng }}"
                data-heading="{{ photo.streetview.heading }}"
                data-pitch="{{ photo.streetview.pitch }}"
              >
                Street View loading...
              </div>
            </div>
          </div>
        {% else %}
          <!-- Standard photo card -->
          <img
            src="{{ "/Salisbury/" | append: photo.id | append: ".jpg" | relative_url }}"
            alt="{{ photo.alt }}"
            loading="lazy"
          >
        {% endif %}
        <div class="sw-card-caption">
          <span class="sw-card-location">{{ photo.location }}</span>
          <span>{{ num }} of {{ total }}</span>
        </div>
      </article>
    {% endfor %}
  </div>

  <!-- Map column -->
  <aside class="sw-map-col" role="complementary" aria-label="Walking route map">
    <div class="sw-map-sticky">
      <div id="salisbury-map"></div>
      <noscript>
        <img
          src="{{ "/Salisbury/myroute.jpg" | relative_url }}"
          alt="Hand-drawn route map of the Salisbury walk"
          style="width:100%; border-radius:8px;"
        >
      </noscript>
    </div>
  </aside>
</div>

<!-- Back link -->
<div class="sw-back">
  <a href="{{ "/" | relative_url }}">Back to danielvaughan.com</a>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
(function() {
  'use strict';

  // --- Map setup ---
  var mapEl = document.getElementById('salisbury-map');
  if (!mapEl) return;

  var routeCoords = [
    {% for coord in site.data.salisbury_walk.route.coordinates %}
      [{{ coord[0] }}, {{ coord[1] }}]{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  // Default centre on Salisbury if no route yet
  var centre = routeCoords.length > 0 ? routeCoords[0] : [51.0700, -1.7950];
  var map = L.map('salisbury-map', { scrollWheelZoom: false }).setView(centre, 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Draw route polyline
  if (routeCoords.length > 1) {
    L.polyline(routeCoords, { color: '#212529', weight: 3, opacity: 0.7 }).addTo(map);
    map.fitBounds(L.polyline(routeCoords).getBounds().pad(0.1));
  }

  // Position marker
  var marker = L.circleMarker(centre, {
    radius: 8,
    fillColor: '#dc3545',
    color: '#fff',
    weight: 2,
    fillOpacity: 1
  }).addTo(map);

  // --- Scroll tracking ---
  var cards = document.querySelectorAll('.sw-card');
  var totalPhotos = cards.length;
  var mobileProgress = document.querySelector('.sw-mobile-progress');
  var progressLocation = document.querySelector('.sw-progress-location');
  var progressCount = document.querySelector('.sw-progress-count');
  var progressFill = document.querySelector('.sw-progress-fill');

  function updatePosition(index) {
    // Update map marker — interpolate along route
    if (routeCoords.length > 1) {
      var fraction = index / Math.max(totalPhotos - 1, 1);
      var segIndex = Math.min(
        Math.floor(fraction * (routeCoords.length - 1)),
        routeCoords.length - 2
      );
      var segFraction = (fraction * (routeCoords.length - 1)) - segIndex;
      var lat = routeCoords[segIndex][0] + segFraction * (routeCoords[segIndex + 1][0] - routeCoords[segIndex][0]);
      var lng = routeCoords[segIndex][1] + segFraction * (routeCoords[segIndex + 1][1] - routeCoords[segIndex][1]);
      marker.setLatLng([lat, lng]);
    }

    // Update mobile progress bar
    var card = cards[index];
    var location = card ? card.querySelector('.sw-card-location') : null;
    var locText = location ? location.textContent : '';
    if (progressLocation) progressLocation.textContent = locText;
    if (progressCount) progressCount.textContent = ' — ' + (index + 1) + ' of ' + totalPhotos;
    if (progressFill) progressFill.style.width = ((index + 1) / totalPhotos * 100) + '%';
  }

  // Intersection Observer
  var currentIndex = 0;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = parseInt(entry.target.dataset.index, 10);
        if (!isNaN(idx)) {
          currentIndex = idx;
          updatePosition(idx);
        }
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  cards.forEach(function(card) {
    observer.observe(card);
  });

  // --- Lazy-load Street View iframes ---
  var streetviewPlaceholders = document.querySelectorAll('.sw-streetview-placeholder');
  var svObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var apiKey = '{{ site.google_maps_api_key }}';
        if (!apiKey) {
          el.textContent = 'Street View (API key not configured)';
          svObserver.unobserve(el);
          return;
        }
        var lat = el.dataset.lat;
        var lng = el.dataset.lng;
        var heading = el.dataset.heading || 0;
        var pitch = el.dataset.pitch || 0;
        var iframe = document.createElement('iframe');
        iframe.className = 'sw-streetview-frame';
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
        iframe.setAttribute('title', 'Google Street View of this location today');
        iframe.src = 'https://www.google.com/maps/embed/v1/streetview'
          + '?key=' + encodeURIComponent(apiKey)
          + '&location=' + lat + ',' + lng
          + '&heading=' + heading
          + '&pitch=' + pitch;
        el.parentNode.replaceChild(iframe, el);
        svObserver.unobserve(el);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0
  });

  streetviewPlaceholders.forEach(function(el) {
    svObserver.observe(el);
  });

  // --- Map click to scroll ---
  if (routeCoords.length > 1) {
    map.on('click', function(e) {
      // Find nearest photo by interpolated position
      var clickLat = e.latlng.lat;
      var clickLng = e.latlng.lng;
      var bestIndex = 0;
      var bestDist = Infinity;
      for (var i = 0; i < totalPhotos; i++) {
        var frac = i / Math.max(totalPhotos - 1, 1);
        var si = Math.min(Math.floor(frac * (routeCoords.length - 1)), routeCoords.length - 2);
        var sf = (frac * (routeCoords.length - 1)) - si;
        var lat = routeCoords[si][0] + sf * (routeCoords[si + 1][0] - routeCoords[si][0]);
        var lng = routeCoords[si][1] + sf * (routeCoords[si + 1][1] - routeCoords[si][1]);
        var dist = Math.pow(clickLat - lat, 2) + Math.pow(clickLng - lng, 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }
      cards[bestIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
</script>
```

- [ ] **Step 2: Build and verify the page renders**

Run: `bundle exec jekyll build 2>&1 | tail -5`
Expected: Build succeeds. Verify `_site/salisbury-walk/index.html` exists and contains all 72 photo cards.

Run: `grep -c 'sw-card' _site/salisbury-walk/index.html`
Expected: A number ≥ 72 (multiple matches per card element).

- [ ] **Step 3: Commit**

```bash
git add salisbury-walk/index.html
git commit -m "feat: build Salisbury walk page with photo grid, Leaflet map, and scroll tracking"
```

---

### Task 5: Verify locally with Jekyll serve

**Files:** None (verification only)

- [ ] **Step 1: Start local server and verify the page loads**

Run: `bundle exec jekyll serve --detach`
Navigate to: `http://localhost:4000/salisbury-walk/`

Verify:
- Hero shows "A Walk Around Salisbury" / "October 2002"
- All 72 photos render in sequence with "N of 72" captions
- Map panel appears on the right with OpenStreetMap tiles
- Scrolling updates the red marker on the map
- On narrow viewport (<768px), map disappears and mobile progress bar shows
- No console errors

- [ ] **Step 2: Stop the server**

Run: `pkill -f "jekyll serve"` or use the PID from the detach output.

- [ ] **Step 3: Commit any fixes if needed**

---

### Task 6: Phase 2 preparation — location identification checkpoint

**Files:**
- Modify: `_data/salisbury_walk.yml`

This is a **collaborative task** — it requires working with the user to identify locations in the photos and add coordinates to the data file.

- [ ] **Step 1: Show photos to the user and gather location identifications**

Go through photos systematically. For each recognisable location:
1. Show the photo to the user
2. Get a location name / street name
3. Look up approximate coordinates using the route map (`Salisbury/myroute.jpg`) and OpenStreetMap
4. Determine the camera heading (direction the photo was taken)

- [ ] **Step 2: Update `_data/salisbury_walk.yml` with locations, alt text, and comparison data**

For each identified location, **update the existing entry** in the data file (do not add new entries — these already exist from Task 1). Example of updating PA180010:
```yaml
  - id: "PA180010"
    location: "New Canal Street"
    orientation: "landscape"
    alt: "Row of red-brick terraced houses on New Canal Street"
    comparison: true
    streetview:
      lat: 51.0693
      lng: -1.7957
      heading: 180
      pitch: 0
```

- [ ] **Step 3: Update route coordinates**

Replace the placeholder `route.coordinates` array with the actual walking route plotted on OpenStreetMap, using the identifications from step 1 and `Salisbury/myroute.jpg` as reference.

- [ ] **Step 4: Build and verify Street View embeds appear at comparison points**

Requires `google_maps_api_key` to be set in `_config.yml` for Street View to load.

Run: `bundle exec jekyll serve`
Navigate to: `http://localhost:4000/salisbury-walk/`
Verify: Comparison cards show 2002 photo left, Street View iframe right at marked locations.

- [ ] **Step 5: Commit**

```bash
git add _data/salisbury_walk.yml _config.yml
git commit -m "feat: add location data and Street View comparisons for Salisbury walk"
```

---

### Task 7: Polish — loading states and performance

**Files:**
- Modify: `salisbury-walk/index.html`

- [ ] **Step 1: Add a skeleton/shimmer loading state for Street View placeholders**

In the `<style>` block, add:

```css
.sw-streetview-placeholder {
  background: linear-gradient(90deg, #f0f4f8 25%, #e4e9ed 50%, #f0f4f8 75%);
  background-size: 200% 100%;
  animation: sw-shimmer 1.5s infinite;
}
@keyframes sw-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

- [ ] **Step 2: Add smooth scroll-into-view animation when map marker is clicked**

Already implemented in Task 4 via the map click handler. Verify it works.

- [ ] **Step 3: Verify all images use `loading="lazy"`**

Run: `grep -c 'loading="lazy"' _site/salisbury-walk/index.html`
Expected: 72 (one per photo).

- [ ] **Step 4: Verify no console errors on page load**

Run: `bundle exec jekyll serve`
Open browser devtools console at `http://localhost:4000/salisbury-walk/`.
Expected: No errors. Street View placeholders show "API key not configured" if key is empty — this is expected.

- [ ] **Step 5: Commit**

```bash
git add salisbury-walk/index.html
git commit -m "feat: add loading shimmer and verify lazy loading for Salisbury walk"
```
