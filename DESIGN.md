---
name: AgentDB
description: A trusted, evidence-led front door to the agent economy.
colors:
  ink: "#121212"
  deep-signal: "#1a1a18"
  acid-lime: "#d9ff45"
  canvas: "#f4f4f1"
  field: "#f5f5f0"
  card: "#f1f1ec"
  paper: "#ffffff"
  text-soft: "#c8c8c2"
  text-muted: "#5d5d58"
  rule: "#c9c9c3"
typography:
  display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(54px, 7.2vw, 96px)"
    fontWeight: 570
    lineHeight: 0.91
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(38px, 5vw, 68px)"
    fontWeight: 570
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "23px"
    fontWeight: 570
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "16px"
    fontWeight: 570
    lineHeight: 1.55
  label:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "11px"
    fontWeight: 760
    lineHeight: 1.4
  micro:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "9px"
    fontWeight: 700
    lineHeight: 1.4
  caption:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.4
  metadata:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 650
    lineHeight: 1.5
  card-copy:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "13px"
    fontWeight: 570
    lineHeight: 1.55
  supporting:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 570
    lineHeight: 1.6
  lead:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "17px"
    fontWeight: 570
    lineHeight: 1.55
  hero-lead:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(17px, 1.7vw, 22px)"
    fontWeight: 570
    lineHeight: 1.45
  fact:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "20px"
    fontWeight: 760
    lineHeight: 1.1
  card-heading:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "25px"
    fontWeight: 570
    lineHeight: 1
  outcome-heading:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(25px, 3vw, 42px)"
    fontWeight: 570
    lineHeight: 1
    letterSpacing: "-0.025em"
  responsive-heading:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(36px, 4.5vw, 64px)"
    fontWeight: 570
    lineHeight: 1
    letterSpacing: "-0.035em"
  responsive-display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(45px, 7vw, 88px)"
    fontWeight: 570
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  trust-display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(50px, 7vw, 92px)"
    fontWeight: 570
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  tablet-display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(50px, 10vw, 76px)"
    fontWeight: 570
    lineHeight: 0.91
    letterSpacing: "-0.04em"
  mobile-display:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "clamp(44px, 13vw, 62px)"
    fontWeight: 570
    lineHeight: 0.91
    letterSpacing: "-0.04em"
rounded:
  action: "10px"
  compact: "12px"
  surface: "16px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "28px"
  section: "120px"
components:
  search-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.compact}"
    height: "60px"
  search-action:
    backgroundColor: "{colors.acid-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    width: "64px"
    height: "60px"
  signal-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
    padding: "16px"
  outcome-card:
    backgroundColor: "{colors.deep-signal}"
    textColor: "{colors.field}"
    rounded: "{rounded.surface}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.field}"
    rounded: "{rounded.action}"
    padding: "0 22px"
    height: "48px"
  agent-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "26px"
---

# Design System: AgentDB

## Overview

**Creative North Star: "The Trust Desk"**

AgentDB feels like the editorial front desk of a live marketplace: direct enough for a first-time buyer, precise enough to earn confidence from a crypto-native visitor. Large, tightly set statements establish the decision at hand while compact live records turn network activity into human-readable proof. The page moves from understanding to choosing, verifying, and hiring without presenting protocol machinery as the product.

The visual world is monochrome, warm rather than sterile, and deliberately restrained. Near-black stages carry the promise and process; warm paper surfaces hold choices and evidence; acid lime marks only active signals, marketplace facts, and decisive moments. Grayscale category imagery adds subject matter without fragmenting the palette.

**Key Characteristics:**

- Editorial scale contrast: monumental promises beside compact evidence labels.
- Live data is composed as a trust path, not as a technical dashboard.
- Warm off-whites and graphite blacks keep the marketplace tactile and calm.
- Acid lime is rare, functional, and unmistakably active.
- Asymmetry and staggered records create motion without sacrificing legibility.

## Colors

The palette is a warm monochrome field punctuated by one high-energy signal color.

### Primary

- **Acid Signal:** The only chromatic accent; use it for active search controls, live counts, proof bands, process markers, selection, and high-intent hover states.

### Neutral

- **Editorial Ink:** Primary text, dark stages, dark calls to action, and high-contrast focus treatment.
- **Deep Signal:** A subtly warmer inner surface for the live-agent stack and image-backed cards.
- **Marketplace Canvas:** The warm page ground that separates the experience from pure-white utility pages.
- **Search Field:** The light input and inverse text surface on dark sections.
- **Evidence Card:** The warm light surface for agents, empty states, and compact records.
- **Paper:** Hover lift and the footer's outer field.
- **Soft Text:** Supporting copy on dark stages.
- **Muted Text:** Supporting copy and metadata on light stages.
- **Ledger Rule:** Dividers, card seams, and structural lines.

### Named Rules

**The Live Wire Rule.** Acid Signal marks action or evidence that is alive now; it is never ambient decoration.

**The Warm Monochrome Rule.** Use the established warm grays instead of blue-gray dashboard neutrals or clinical white-on-black contrast.

## Typography

**Display Font:** Archivo Variable (with sans-serif fallback)  
**Body Font:** Archivo Variable (with sans-serif fallback)  
**Label Font:** Archivo Variable (with sans-serif fallback)

**Character:** A single variable grotesk carries the whole system. Authority comes from extreme scale, dense spacing, and weight contrast rather than a decorative font pairing; tabular numerals keep live facts stable and credible.

### Hierarchy

- **Display:** Dense, oversized sentence-case promises. Use the display token for the hero; compact to roughly `44–62px` on small screens while retaining the tight line height.
- **Headline:** Major section statements with near-solid leading and negative tracking. Trust statements may expand toward the display scale.
- **Title:** Short process and card headings; firm and compact, never ornamental.
- **Body:** Plain-language explanation, usually constrained to about `58ch` or a `570–600px` measure.
- **Label:** Compact evidence, counts, stages, and navigation. Strong weight and short phrasing replace gratuitous all-caps; use tabular numerals for changing totals and scores.

### Named Rules

**The One Voice Rule.** Keep Archivo across display, body, and UI; create hierarchy through scale, spacing, and weight.

**The Wide Promise Rule.** Major headlines are short, balanced, and allowed to occupy real width; do not turn them into narrow multi-line ribbons.

## Layout

The core container is capped at `1180px` with `16px` side gutters, expanding to `32px` of total viewport inset on wider screens. Desktop storytelling uses decisive two-column splits: promise and live signals, sticky explanation and steps, statement and trust ledger. Section spacing is generous—typically around the section token—with compact gaps inside evidence clusters.

Outcome cards form an asymmetric two-column mosaic rather than a uniform catalog grid. Agent evidence uses staggered offsets, paired strips, one-pixel seams, and ledger rows to suggest sequence and verification. At `900px`, major split layouts collapse to one column and the proof band becomes two columns. At `640px`, outcome and featured grids become single-column, staggered signal offsets disappear, major sections tighten to roughly `88px`, and typography scales down without losing its editorial contrast. Navigation simplifies below `850px`, hiding the secondary explanatory link while retaining Browse agents and Jobs.

**The Journey Grid Rule.** Layout must reinforce understand → choose → verify → hire; technical evidence may deepen a step but may not become a competing first-level journey.

## Elevation & Depth

The system is flat by default. Depth comes first from tonal contrast, image overlays, one-pixel rules, nested surfaces, and overlap; only the live signal stack receives a strong ambient shadow. Hover responses use color shifts or small translation rather than card-by-card floating elevation.

### Shadow Vocabulary

- **Signal Stack:** A broad, dark ambient shadow gives the live proof module physical presence against the hero.

### Named Rules

**The Evidence Has Weight Rule.** Reserve pronounced shadow for the live signal stack; ordinary marketplace cards remain flat and are separated by tone or rules.

## Shapes

The homepage uses gently rounded rectangles, not glass pills or ornamental blobs. Primary surfaces use the surface radius, compact records and fields use the compact radius, and action controls use the action radius. Search is a joined two-part silhouette: rounded only on the outer left and right corners. Agent avatars echo their parent card with compact rounded corners. Circles belong to small utility icons; pills are not a dominant homepage container shape.

Image-backed outcome cards clip grayscale photography inside a surface-radius frame with a dark bottom overlay. Thin rules establish ledgers and stages; they should remain visible but quiet.

## Components

### Buttons

- **Shape:** Compact rounded rectangle using the action radius; the hero search action inherits the joined compact search silhouette.
- **Primary:** Editorial Ink on Search Field, strongly weighted and at least `48px` high.
- **Active Accent:** Acid Signal with Editorial Ink is reserved for direct search, proof, or selected marketplace states.
- **Hover / Focus:** Use a small directional or rotational gesture where an icon exists. All focus-visible states receive a `3px` high-contrast outline with a clear offset; inside the dark hero that outline switches to Acid Signal.

### Cards / Containers

- **Signal Cards:** Light evidence records inside a dark framed stack; rows stagger by `18px` on desktop, slide left on hover, and enter sequentially only when reduced motion is not requested.
- **Outcome Cards:** Grayscale, contrast-raised imagery under a dark vertical overlay. Copy stays bottom-aligned and the relevant-agent count uses Acid Signal.
- **Agent Cards:** A gapless two-column strip of warm cards separated by a one-pixel Ledger Rule seam. Hover changes the whole card to Acid Signal instead of adding shadow.
- **Empty States:** Preserve the same card geometry and plain voice; state that live data is unavailable without inventing fallback proof.

### Inputs / Fields

- **Style:** A warm light field joined to a square-ish accent action; no resting shadow in the hero.
- **Focus:** An inset Acid Signal ring keeps the field visible without changing layout.
- **Copy:** Placeholder language accepts names, skills, services, or wallets, keeping technical identifiers optional rather than primary.

### Navigation

The header is a `64px` Editorial Ink bar with a crisp Archivo wordmark and three direct marketplace links. Labels are muted at rest and white on hover or primary state. Subtle geometric texture may sit behind the header at low opacity, but navigation remains the foreground. On compact screens, remove the explanatory middle link before compressing the primary routes.

### Proof Band

The full-width Acid Signal band turns live marketplace facts into four equal-height editorial cells. Values lead, labels explain, and thin dark rules supply structure. It is proof, not promotional decoration.

### Trust Ledger

A definition-list structure pairs compact proof categories with plain-language explanations. Each row uses a quiet bottom rule and consistent label column, collapsing to a narrower label track on small screens.

## Do's and Don'ts

### Do:

- **Do** lead with a plain outcome promise and an obvious search path.
- **Do** use real identity, connection, feedback, and category counts as visual material.
- **Do** translate onchain evidence into compact labels with deeper details available later.
- **Do** reserve Acid Signal for active states, verified facts, selections, and decisive actions.
- **Do** preserve honest unavailable, new, and unverified states in the same polished component system.
- **Do** honor reduced-motion preferences for staged signal entrances.

### Don't:

- **Don't** make protocol names, hashes, endpoints, or wallet connection the homepage's visual hierarchy.
- **Don't** imply hireability, price, performance, or completed work without evidence.
- **Don't** introduce competing accent colors, gradients, glass effects, or blue-gray dashboard styling.
- **Don't** turn every container into an elevated card; use tone, rules, and spacing first.
- **Don't** use Acid Signal as a decorative wash that weakens its meaning.
- **Don't** collapse the editorial hierarchy into a uniform grid of interchangeable tiles.
