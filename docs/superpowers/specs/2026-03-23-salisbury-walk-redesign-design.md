# Salisbury Walk Redesign — Design Spec

**Date:** 2026-03-23
**Status:** Draft

## Overview

Modernise the "Dan's Walk Around Salisbury" photo gallery (72 photos from October 2002) into an interactive scrolling story with a route map and Google Street View "then vs now" comparisons at key locations.

The new page lives in `salisbury-walk/` — completely separate from the existing `Salisbury/` directory which remains untouched.

## User Decisions

| Decision | Choice |
|---|---|
| Layout | Side-by-side: scrolling story left, sticky map right |
| Comparison style | Side-by-side: 2002 photo left, interactive Street View right |
| Photo scope | All 72 photos in sequence; Street View comparisons at ~15-20 key landmarks |
| Narrative tone | Clean and minimal — location labels and photo numbers only |
| Date | October 18, ~2002 |

## Page Structure

### Location

- **URL:** `/salisbury-walk/`
- **Directory:** `salisbury-walk/index.html`
- **Layout:** `salisbury-walk` (new layout — see below)
- **Data file:** `_data/salisbury_walk.yml`

### Layout

A new layout `_layouts/salisbury-walk.html` is needed because the existing `default` layout wraps content in a `<div class="container">` which constrains max-width and prevents the full-width hero and optimal two-column layout. The new layout will:

- Include `head.html` and `footer.html` (same as `default`)
- Render `{{ content }}` without a container wrapper
- Allow the page itself to control its own width constraints

### Zones

1. **Hero** — full-width, title "A Walk Around Salisbury", subtitle "October 2002"
2. **Main content** — two-column:
   - **Left (~65%):** Scrolling photo sequence. Each photo in a card with location label and number (e.g. "3 of 72"). At comparison points, the card expands to show the 2002 photo and an interactive Street View embed side by side.
   - **Right (~35%):** Sticky Leaflet/OpenStreetMap showing the walking route with a marker that tracks scroll position.
3. **Footer** — link back to main site.

### Responsive Behaviour

- **Desktop (≥992px):** Two-column layout as described.
- **Tablet (768–991px):** Map column narrows to ~30%.
- **Mobile (<768px):** Map collapses to a small sticky progress bar at top showing current location label and progress (e.g. "New Canal Street — 10 of 72"). Photos go full-width. Street View comparisons stack vertically (photo above, Street View below).

## Data Model

`_data/salisbury_walk.yml`:

**Note:** Photo IDs are PA180001–PA180071 plus PA180074. PA180072 and PA180073 do not exist on disk. The data file must enumerate actual filenames, not assume sequential numbering.

```yaml
title: "A Walk Around Salisbury"
date: "October 2002"
route:
  # Array of [lat, lng] pairs defining the polyline
  coordinates:
    - [51.0700, -1.7950]
    - [51.0695, -1.7945]
    # ... more points

photos:
  - id: "PA180001"
    location: "Starting point"
    orientation: "portrait"
    alt: "Front door of B&B, starting point of the walk"
    comparison: false

  - id: "PA180010"
    location: "New Canal Street"
    orientation: "landscape"
    alt: "Row of terraced houses on New Canal Street"
    comparison: true
    streetview:
      lat: 51.0693
      lng: -1.7957
      heading: 180
      pitch: 0
      zoom: 1

  # ... all 72 photos (enumerated by actual filenames on disk)
```

### Photo orientation handling

Photos are either 480x640 (portrait) or 640x480 (landscape). Cards apply a `max-height` constraint so portrait photos don't dominate the viewport. In comparison view, both the 2002 photo and Street View embed are given equal width with `object-fit: contain` to handle mismatched aspect ratios gracefully.

### Photo file references

Photos are referenced using absolute paths: `/Salisbury/{{ photo.id }}.jpg` (or via Jekyll's `relative_url` filter). No files are copied from the existing `Salisbury/` directory.

### Existing route map

The scanned route map `Salisbury/myroute.jpg` serves as a reference for plotting the Leaflet route in Phase 2. It may also be displayed as a "original hand-drawn route" companion element.

## Technology

| Component | Technology | Reason |
|---|---|---|
| Map | Leaflet + OpenStreetMap tiles | Free, no API key, lightweight |
| Street View | Google Maps Embed iframe | Free tier (unlimited requests), requires API key (no cost). Key restricted by HTTP referrer. Stored in `_config.yml` as `google_maps_api_key`. |
| Scroll tracking | Intersection Observer API | Native JS, no dependencies |
| Grid/responsive | Bootstrap (already in site) | Consistent with existing site |
| Static site | Jekyll (already in site) | No new build tools |

### No new dependencies beyond:

- Leaflet CSS/JS (loaded from CDN)
- No npm packages, no build step

## Accessibility

- All photos have `alt` text sourced from the data file
- Map panel has `role="complementary"` and `aria-label="Walking route map"`
- Street View iframes have descriptive `title` attributes
- Page is usable without JavaScript: photos display in sequence, map is a graceful-degradation `<noscript>` static image
- Keyboard navigation: scrollable photo list is focusable, map points are tabbable
- ARIA landmarks for hero, main content, and map regions

## Comparison Points

Photos that warrant a Street View comparison (to be refined with user during Phase 2):

Likely candidates based on visual review:
- Residential streets (PA180010–PA180013)
- Cathedral Close entrance (PA180030 area)
- Market area (PA180050 area)
- Any distinctive buildings or junctions

Exact identification requires the user's input — they will recognise locations from memory.

## Implementation Phases

### Phase 1: Page Scaffold
- Create `_data/` directory and `_data/salisbury_walk.yml` with all 72 photo entries
- Create `_layouts/salisbury-walk.html` (container-free layout)
- Create `salisbury-walk/index.html` with Jekyll front matter
- Build the two-column layout with Bootstrap grid
- Render all 72 photos from the data file
- Add Leaflet map with a placeholder route
- Basic responsive breakpoints
- Add `docs/` to `_config.yml` exclude list

### Phase 2: Location Identification (Collaborative)
- Work through photos with the user to identify locations
- Use `Salisbury/myroute.jpg` as reference for plotting the route
- Add coordinates and Street View parameters to the data file
- Plot the actual walking route on the map

### Phase 3: Interactive Features
- Wire up Intersection Observer to track scroll position
- Update map marker as user scrolls through photos
- Embed Google Street View iframes at comparison points (lazy-loaded via Intersection Observer — only load when card enters viewport)
- Smooth transitions when comparison cards come into view

### Phase 4: Polish
- Loading states/skeleton for Street View iframes
- Smooth scroll-to-photo when clicking map points
- Lazy loading for images below the fold (`loading="lazy"`)
- Lazy loading for Street View iframes (loaded only when near viewport)
- Mobile progress bar animation
- Performance optimisation (72 images + up to 20 iframes need lazy loading)

## Out of Scope

- Modifying or removing the existing `Salisbury/` directory
- User-uploaded "now" photos (only Google Street View)
- Comments or social features
- Blog post or written narrative
- Photo editing or enhancement of originals

## Open Questions

1. Can the user identify enough locations to make 15-20 comparison points compelling?
2. Are there Street View coverage gaps in central Salisbury for any of the walk locations?
3. Should the old `Salisbury/` gallery eventually redirect to the new page?
