---
name: AgentDB
description: A deep-signal registry for exploring and verifying the BNB agent economy.
colors:
  registry-cyan: "#00a9e8"
  evidence-link: "#008fc9"
  signal-lime: "#b8f34a"
  registry-navy: "#061a2c"
  registry-navy-raised: "#0a233a"
  deep-navy: "#071a2c"
  evidence-ink: "#102338"
  secondary-ink: "#617286"
  evidence-line: "#dbe3ea"
  evidence-surface: "#ffffff"
  evidence-canvas: "#f3f6f8"
  verified-teal: "#00a186"
  caution-amber: "#c98900"
typography:
  display:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.55px"
  headline:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "25px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.45px"
  title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.15px"
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "10px"
    fontWeight: 750
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.registry-cyan}"
    textColor: "{colors.evidence-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 13px"
  button-wallet:
    backgroundColor: "#eafaff"
    textColor: "#007cae"
    typography: "{typography.label}"
    rounded: "6px"
    padding: "9px 14px"
    height: "39px"
  input-search:
    backgroundColor: "{colors.evidence-surface}"
    textColor: "{colors.evidence-ink}"
    rounded: "{rounded.md}"
    padding: "15px 19px"
    height: "58px"
  card-evidence:
    backgroundColor: "{colors.evidence-surface}"
    textColor: "{colors.evidence-ink}"
    rounded: "{rounded.xl}"
    padding: "17px 20px"
  chip-status:
    backgroundColor: "#e9f5fc"
    textColor: "#0873ae"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "3px 7px"
---

# Design System: AgentDB

## Overview

**Creative North Star: "The Deep-Signal Registry"**

AgentDB is an Operate-mode explorer: serious, compact, and evidence-first. Its visual world pairs a dark navy live-signal field with crisp white registry surfaces, making onchain records feel active without turning the interface into a trading dashboard. Cyan marks navigation and inspectable evidence; acid lime is reserved for live or verified signal moments.

The structure inherits the useful density of a block explorer, but its identity comes from sonar rings, telemetry traces, compact signal glyphs, and a database-node mark. The Etherscan reference informs information architecture only. The implemented system does not copy its brand, palette, or visual mannerisms.

**Key Characteristics:**

- High-density evidence surfaces on a cool, quiet canvas.
- Dark navy live-signal fields paired with crisp white registry cards.
- Cyan for navigation and inspectable evidence; acid lime for rare live or verification signals.
- Locally bundled Manrope Variable, used at weights 500–800 for legibility and authority.
- Sonar, telemetry, and node geometry expressed through CSS and inline SVG.
- One restrained pulse with a reduced-motion fallback.

## Colors

The palette separates operational chrome, inspectable evidence, and trustworthy signal states with a narrow cyan-and-lime accent range.

### Primary

- **Registry Cyan:** The main interaction color for search actions, linked evidence, icons, and navigation states.
- **Evidence Link:** A darker cyan used where text needs stronger contrast than the primary accent.

### Secondary

- **Signal Lime:** A deliberately scarce live and verification accent used on the sonar pulse, brand node, chart samples, and utility readouts.

### Tertiary

- **Verified Teal:** Positive status and success messaging.
- **Caution Amber:** Warning status and network-attention messaging.

### Neutral

- **Registry Navy:** The hero's live-signal field and primary dark atmosphere.
- **Registry Navy Raised:** A secondary navy for dark tonal layering.
- **Deep Navy:** The supporting dark token used by footer and deep chrome.
- **Evidence Ink:** Primary text on white registry surfaces.
- **Secondary Ink:** Metadata, explanatory text, and low-priority labels.
- **Evidence Line:** Hairline dividers and card boundaries.
- **Evidence Surface:** White panels, controls, and evidence containers.
- **Evidence Canvas:** The cool page background behind evidence surfaces.

**The Scarce Signal Rule.** Acid lime marks an actual live or verification cue; it is never a general-purpose fill, link color, or decorative wash.

**The Evidence Contrast Rule.** Dense records live on white or near-white surfaces with dark ink; navy is reserved for framing, orientation, and the live-signal hero.

## Typography

**Display Font:** Manrope Variable (with sans-serif fallback)  
**Body Font:** Manrope Variable (with sans-serif fallback)  
**Label Font:** Manrope Variable (with sans-serif fallback)

**Character:** The single locally bundled variable family keeps the explorer technical without feeling anonymous. Medium weights carry dense data, while compact extra-bold headings and labels establish hierarchy without oversized typography.

### Hierarchy

- **Display** (800, 26px, 1.5): Homepage hero statement; tight negative tracking keeps it compact. It becomes 22px on narrow mobile screens.
- **Headline** (800, 25px, 1.5): Page and entity titles.
- **Title** (800, 16px, 1.5): Panel and section headings.
- **Body** (500, 15px, 1.5): Default application copy; the root size becomes 14px below the narrow breakpoint.
- **Label** (750, 10px, 0.08em): Uppercase metrics and telemetry labels. Supporting metadata commonly uses 10–12px at weights 550–700.

**The Compact Authority Rule.** Create hierarchy with weight, tracking, and surface placement before increasing type size.

## Layout

The shared container is capped at 1240px with 20px gutters per side. The homepage moves from the dark hero into an overlapping three-column registry summary, then two equal evidence feeds, followed by a four-column category grid. The overlap is structural: the summary card bridges the live-signal field and the evidence canvas.

Spacing is compact and repeatable, centered on 8px, 12px, 16px, 20px, and 24px steps. Rows favor fixed minimum heights and thin dividers so scanning remains predictable. At 850px, primary navigation hides, the summary becomes two columns with its chart spanning the row, and split panels stack. At 560px, the container gutter becomes 12px per side, summaries and categories become single-column, header height compresses, and footer content uses two columns.

**The Evidence-First Density Rule.** Keep rows and cards compact enough to compare records, but preserve clear group boundaries and stable alignment for names, metadata, status, and timestamps.

## Elevation & Depth

Depth is a restrained hybrid of tonal layering, hairline borders, and cool navy shadows. White evidence surfaces sit above the cool canvas; stronger shadow is reserved for the header, hero search, overlapping summary, and hovered category tile. Ordinary panels use a quiet shadow and visible border rather than floating dramatically.

### Shadow Vocabulary

- **Header Lift** (`0 4px 18px rgba(5, 28, 49, 0.07)`): Separates global navigation from the page.
- **Search Focus Plane** (`0 12px 30px rgba(0, 0, 0, 0.28)`): Anchors the main search against the navy hero.
- **Summary Bridge** (`0 18px 45px rgba(7, 31, 53, 0.13)`): Supports the hero-to-content overlap.
- **Evidence Rest** (`0 7px 22px rgba(10, 35, 55, 0.055)`): Gives panels a quiet, persistent edge.
- **Category Hover** (`0 8px 20px rgba(7, 60, 84, 0.08)`): Accompanies the 2px upward hover shift.

**The Structural Shadow Rule.** Shadows explain stacking or interaction; they do not decorate every container.

## Shapes

The system uses softly engineered corners rather than pills: compact controls start around 4–8px, the hero search reaches 10px, category tiles use 12px, and major evidence cards use 14px. Circular geometry is reserved for agents, live nodes, status dots, and sonar rings. Task glyphs use compact rounded rectangles so identity and activity remain visually distinct.

Borders are one-pixel cool gray or cyan-tinted strokes. Inline icons are lean, rounded line drawings; the brand mark combines database rings with a linked live node. Large decorative geometry stays clipped inside the hero or metric chart.

**The Semantic Geometry Rule.** Circles mean agents, nodes, or live signal; rounded rectangles mean tasks, controls, or bounded evidence.

## Components

### Buttons

- **Shape:** Compact rounded rectangles, typically 5–8px radius.
- **Primary:** Registry cyan with white text, medium padding, and weight 600–750.
- **Hover / Focus:** Darker cyan on hover; native focus visibility must remain intact.
- **Wallet / Secondary:** Pale cyan surface, cyan border, and deep cyan text; warning state switches to the established amber treatment.

### Chips

- **Style:** Small status labels use a 4px radius, 3px by 7px padding, and bold 10px text.
- **State:** Muted, info, success, warning, and danger variants use pale tonal fields with darker readable text; labels describe real record state only.

### Cards / Containers

- **Corner Style:** Major panels use 14px corners; category tiles use 12px.
- **Background:** White evidence surfaces on the cool canvas; chart subregions may use a near-white blue-gray field.
- **Shadow Strategy:** Use Evidence Rest for standard panels and Summary Bridge only for the hero overlap.
- **Border:** One-pixel Evidence Line or a closely related cool-gray boundary.
- **Internal Padding:** Usually 14–20px; dense feed rows use 13px by 19px.

### Inputs / Fields

- **Style:** The hero search is a 58px white field with 10px outer corners and a compact cyan icon action inset by 6px. Compact search retains a visible gray border.
- **Focus:** Preserve the browser's visible keyboard focus treatment; interactive color may deepen to Evidence Link.
- **Error / Disabled:** Disabled commerce controls lower opacity; unavailable data is stated in copy rather than implied by disabled decoration.

### Navigation

The utility bar is dark, compact, and status-oriented. The 74px white primary header uses a bold brand, 13px links, cyan active/hover color, a square appearance control, and the pale-cyan wallet action. Primary links hide at 850px while brand and actions remain available.

### Live-Signal Hero

The homepage hero layers navy, topographic telemetry traces, cyan sonar rings, and one acid-lime pulse. The pulse runs for 2.8 seconds with ease-out timing and stops when reduced motion is requested. No other element should compete with a repeating animation.

### Evidence Feed

Feed rows align a semantic icon, a truncating identity or event label, and right-aligned time/status metadata. A small green signal dot distinguishes current indexed activity, while dividers and stable row heights preserve scan rhythm.

## Do's and Don'ts

### Do:

- **Do** present real agent, registration, task, network, and verification data; use explicit unavailable and empty states when evidence is absent.
- **Do** use cyan for inspectable evidence and acid lime only for a live or verified signal.
- **Do** keep shared screens inside the 1240px container and preserve compact, aligned evidence rows.
- **Do** use the locally bundled Manrope Variable family at weights 500–800.
- **Do** preserve reduced-motion behavior for the single signal pulse.

### Don't:

- **Don't** fabricate counts, prices, task history, hireability, or trust claims to make a surface feel complete.
- **Don't** turn the interface into a neon trading terminal or cover white evidence surfaces with dark panels.
- **Don't** add additional looping animations, ambient particle fields, or competing pulses.
- **Don't** copy Etherscan's brand identity; use it only as structural evidence for explorer density and information architecture.
- **Don't** substitute generic icon-library glyphs for the established database-node, sonar, activity, task, and arrow grammar.
