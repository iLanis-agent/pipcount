# PipCount

Backgammon pip counting, doubling-cube race advice, and dice odds. Static, no build, no dependencies. Open `app.html` or visit the GitHub Pages site.

## What it does

- **Pip count**: enter both sides' checkers per point (24 values) for instant counts and race standing.
- **Cube advice**: the published 8-9-12 rule of thumb - double at an 8% lead, redouble at 9%, take within 12% - for pure races only.
- **Hit odds**: outcomes out of the 36 ordered rolls that hit a blot at each distance 1-24 (direct die, two-dice sum, double steps).
- **Bar entry**: odds of entering from the bar with 1-6 home points open.

## Limits

Cube advice applies to contact-free races and ignores bearoff structure, wastage, and gammon value. Hit odds use the simple model: blockers between the blot and shooter are ignored.

## Development

Pure JS engine (`engine.js`), browser and Node compatible. Tests run the engine against a python oracle plus published reference values (`tests/build_corpus.py` generates `tests/expected.json`):

```
python3 tests/build_corpus.py
node tests/run_tests.js
```

Built as app #400 of the app factory.
