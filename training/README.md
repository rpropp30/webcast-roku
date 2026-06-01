# Powerline Worker — Electrical Theory & Energized-Line Safety Training

A complete, in-depth (76-slide) field-training program for lineworkers, taking you from
first-principles electrical theory through working around energized lines, cover-up and
tools, field application (hazard assessment / tailboards / roles / rescue), and the
regulations that govern the work.

## Deliverables

| File | What it is |
|------|------------|
| **`landing.html`** | A designed, graphical **landing page** — hero, stats, module cards, the core-concept feature, and a gallery of all 24 technical illustrations. **Start here.** |
| **`index.html`** | The presentation — a self-contained HTML slide deck of **106 slides** (76 teaching + 30 illustrated). **Open it in any browser and press `F` for fullscreen.** |
| `diagrams.js` | The technical SVG illustration library — **30 hand-built vector diagrams**, shared by the deck and the landing page. Pure geometry, scales razor-sharp at any size. |
| `Powerline_Electrical_Theory_and_Safety_Training.pptx` | Native PowerPoint version — **now also 106 slides with all 30 illustrations embedded** as images. |
| `build_presentation.py` | Generator that builds the `.pptx` (`python3 build_presentation.py`; needs `python-pptx` + `Pillow`). |
| **`quiz.html`** | Interactive, self-grading **knowledge check** — 31 questions across the six modules. Take the **whole set or one module at a time** (tabs), with instant feedback, explanations, a live score, and a per-module breakdown. |
| **`facilitator-guide.html`** | **Instructor playbook** — agenda &amp; timing, materials checklist, module-by-module teaching points, discussion prompts, common misconceptions, hands-on demos, and assessment/sign-off. Print-friendly. |
| **`field-card.html`** | A **print-friendly one-page field card** (MAD table, glove classes, LOTO + grounding order, shock thresholds, rescue steps, second-point reminder). Print or save to PDF for the truck. |
| `notes.json` / `notes.js` | Instructor **speaker notes** (one source of truth) — read by the deck and embedded into the PowerPoint. |
| `assets/` | The 30 illustrations pre-rendered to PNG (used by the PowerPoint build; produced from `diagrams.js`). |

## Presenting features

- **Animated diagrams** — key figures animate in the live deck (current flowing through the body and the second-point circuit, AC/three-phase waveforms sweeping, electrons orbiting/drifting, the arc flickering, the reclose sequence stepping, a pulse traveling the grid). Honors `prefers-reduced-motion`; static PNG/PowerPoint renders are unaffected.
- **Speaker notes** — press **`N`** (or the *Notes* button) to toggle an instructor notes drawer for the current slide. The same notes are embedded in every PowerPoint slide's notes pane.
- **Dark theme** — press **`D`** (or the *Theme* button) for a dark palette suited to darkened rooms; the choice is remembered.

| Key | Action |
|-----|--------|
| `→` `↓` `Space` / click | Next · `←` `↑` / click-left: Previous |
| `Home` / `End` | First / last · `F` Fullscreen · `O` Overview |
| **`N`** | Speaker notes · **`D`** Dark theme |

> The three HTML files belong together in this folder — `index.html` and `landing.html` both load `diagrams.js`.

## The technical illustrations (30)

Hand-coded SVG, interleaved through the deck right after the concept they illustrate (and embedded in the `.pptx`):

**Theory** — atom & electron flow · conductors vs insulators · the water analogy · potential difference (bird on a wire) · Ohm's law & power wheel · AC vs DC waveforms · three-phase · transformer · the grid end-to-end.
**The body** — current path through the body · shock-threshold ladder · arc flash & blast · step & touch potential · reclosers / auto-reclose.
**Working energized** — hierarchy of controls · minimum approach distance · the insulated aerial (bucket) device · **the second point of contact** (hero) · cover-up at the pole top · the LOTO sequence · the equipotential zone · induced voltage.
**Tools** — rubber glove voltage classes · hot stick · phasing / voltage testing · protective grounds · head-to-toe PPE.
**Field** — the tailboard briefing · switching & the clearance · pole-top rescue.

## Why HTML is the primary format

The deck is built on a fixed **1280×720 "slide stage" that auto-scales** to fill any
screen, so every slide always fits the display in full-screen mode with **no scrolling** —
exactly like PowerPoint, but with room for the rich SVG diagrams and illustrations planned
next. Each slide has an `art` slot ready for graphics.

## Presenting

Open `index.html` in Chrome, Edge, Firefox, or Safari.

| Control | Action |
|---------|--------|
| `→` `↓` `Space` / click right | Next slide |
| `←` `↑` / click left edge | Previous slide |
| `Home` / `End` | First / last slide |
| `F` | Toggle fullscreen |
| `O` / `Esc` | Toggle the slide overview grid |
| swipe | Next / previous (touch screens) |

The current slide is reflected in the URL hash (e.g. `#42`) so you can deep-link or resume.

## Structure (6 modules + intro/wrap-up)

1. **Electrical theory** — charge, voltage, current, resistance, Ohm's law, power, AC/DC,
   three-phase, transformers, the grid, voltage classes.
2. **Electricity & the human body** — shock physiology & thresholds, the heart, burns,
   arc flash/blast, step & touch potential, downed conductors.
3. **Working around energized lines** — hierarchy of controls, minimum approach distance,
   **the second point of contact**, insulate/isolate, cover-up sequence & equipment,
   de-energizing/LOTO, grounding & the equipotential zone, induced voltage.
4. **Tools of the trade** — rubber gloves/sleeves/blankets/line hose, hot sticks,
   protective grounds, voltage detectors, arc-rated FR PPE, inspection & test intervals.
5. **In the field** — pre-job planning, JSA/hazard assessment, the tailboard/job briefing,
   roles & responsibilities, communication, emergency response & rescue, weather/public.
6. **Regulations & standards** — OSHA 1910.269 & 1926 Subpart V, NESC (IEEE C2),
   ASTM/IEEE/ANSI equipment standards, qualification & apprenticeship, recordkeeping.

> **Accuracy note:** Numeric tables (minimum approach distances, current thresholds, test
> intervals) are *illustrative* for training discussion. Always work to your employer's
> current, approved MAD tables and the governing edition of OSHA 1910.269 / NESC.
