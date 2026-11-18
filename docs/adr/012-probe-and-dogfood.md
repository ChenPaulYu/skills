# ADR-012 — Probe and dogfood

Status: accepted · 2026-11-18

## Decision

`shape:probe` asks reality when a choice cannot be settled by argument, or assesses
existing measurements: A/B runs, blind judges, behavior probes. Missing
preregistration is reported, never fabricated. `shape:dogfood` uses a built feature
through its real browser or CLI against a list of user intents and reports friction
and missing intent coverage.

## Evidence and alternatives

- A top-down state-by-action logic walk (`rehearse`) was replaced by dogfood: walking
  the real interface found what the walk missed.
- More reasoning when a choice is empirical was rejected; measure instead.
