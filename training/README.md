# Powerline Worker — Electrical Theory & Energized-Line Safety Training

A complete, in-depth (76-slide) field-training program for lineworkers, taking you from
first-principles electrical theory through working around energized lines, cover-up and
tools, field application (hazard assessment / tailboards / roles / rescue), and the
regulations that govern the work.

## Deliverables

| File | What it is |
|------|------------|
| **`index.html`** | The primary presentation — a self-contained HTML slide deck (no internet, no dependencies). **Open it in any browser and press `F` for fullscreen.** |
| `Powerline_Electrical_Theory_and_Safety_Training.pptx` | The same content as a native PowerPoint file, for editing/printing in PowerPoint or Google Slides. |
| `build_presentation.py` | Generator script that builds the `.pptx` (run `python3 build_presentation.py`, needs `python-pptx`). |

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
