# Fretwork

A complete acoustic-guitar reference and structured learning path, built as a
single self-contained HTML file. No build step, no runtime network requests –
it works fully offline and installs to your phone as a PWA.

## Features

- **Getting started** – tuning reference tones, posture, technique, how to read diagrams.
- **Chords** – an interactive library grouped from easiest to hardest, with a zoomable
  fingering view and a **progression builder** to drill chord changes at your own tempo.
- **Scales** – a fretboard visualiser (pentatonics, blues, major, natural minor) showing
  one CAGED-style box at a time, with notes that light up in sequence as they play.
- **Curriculum** – three stages, twelve modules, authored lessons with progress tracking.
- **Tools** – a Web Audio metronome and tap tempo.

All audio is Karplus-Strong plucked-string synthesis via the Web Audio API. Progress is
saved to `localStorage`, with JSON export/import as a backup.

## Run it

Just open `index.html` in any modern browser. To install on iOS: open the hosted URL in
**Safari**, then **Share → Add to Home Screen**.

## Build

The app is a single file. The only build step is embedding the fonts (Baloo 2 + Nunito,
[SIL Open Font License](https://openfontlicense.org)) as base64 so there are no runtime
network requests:

```sh
node build-fonts.js   # regenerates the @font-face block, then paste into index.html
```
