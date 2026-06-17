---
date: 2026-06-17
status: raw
---

# Verifying an audio change means asserting on the MEASURED OUTPUT (an analyser tap under --mute-audio), not any proxy — for audio, even a reactive-STATE proxy advances while the output is dead silent

> Source: browser-verifying a generative-instruments spike (a dynamically-registered step-sequencer `AudioProcessor`) during a TrackMate dogfood/build session. The device *looked* alive but made no sound; only measuring the output caught it.

## What prompted it

A generated step-sequencer was wired up and "verified" by watching its `currentStep` reactive cell advance (3→4→6→0→1…) after pressing play — the playhead moved, the button flipped to "stop", `buf loaded`, `fired` incremented. Every visible signal said *it's running*. I reported it demonstrated.

The user asked one question: **"but does it have sound?"** It did not. A React StrictMode lifecycle bug (register/connect in a `useState` initializer, destroy in an effect cleanup → StrictMode's mount→fake-unmount→remount **destroyed and disconnected** the instance, but `useState` never recreated it) meant `play()` ran on a **severed** processor: the scheduler timer still ticked (so `currentStep` advanced and `fired` counted), but the output node was disconnected from the destination → **silent**, and its analyser tap was severed too. Adding an analyser level meter that read the actual output (peak amplitude, with peak-hold) revealed `0.000` throughout; the lazy-ref-init fix then showed `0.04–0.49`.

## The signal

The browser-verify discipline already says **assert on state, not DOM text** (motion-mounted nodes make `textContent.includes` a false positive). This session shows that for **audio**, *state itself is also a proxy* — and a treacherous one, because the most natural "good" signal (a reactive playhead/position cell advancing) confirms only that **the scheduler is running**, not that **sound reaches the output**. The two decoupled exactly here: timer alive, audio graph severed. Asserting on the advancing cell was a green light for a silent device.

The move:

1. **For an audio change, assert on the MEASURED OUTPUT** — tap an `AnalyserNode` on the master/output, read `getFloatTimeDomainData` peak (peak-hold over rAF, because hits are sparse — a single instantaneous read samples the gaps and reads ~0 even when it's playing). Non-zero level = sound genuinely produced. This is the only proxy that can't lie about silence.
2. **You can verify sound WITHOUT making noise.** Keep `--mute-audio` ON (the mandatory rule): the Web Audio graph still *computes* under mute (mute is at the output device, not the graph), so a mid-graph analyser sees the real signal. "Measure the output" and "don't make noise in the test" are compatible — the analyser is how. (I briefly ran *unmuted* to "hear it" — wrong instinct; the analyser-under-mute is the right one.)
3. **Order the diagnostics from output backward.** When the meter read 0, the decisive isolation was an immediate test oscillator straight to master (does the master/analyser path carry *anything*?) + a `fired` counter (are sources even created?) + reading `ctx.state`/`currentTime`/gain. That sequence localized it to "graph severed, not scheduler dead" — which pointed at the React lifecycle, not the audio code.

The deeper atom: **a moving playhead is a claim about the clock, not about the sound.** Audio uniquely decouples "the schedule is advancing" from "audio reaches the speakers" (a disconnected node, a zero gain, a wrong context, a muted-too-hard chain). Every non-output proxy — text, *and* reactive state — can show the first while the second is dead. The only assertion that closes the gap is a measurement of the output signal itself.

## Evidence so far

- **Only case (2026-06-17, TrackMate generative-instruments spike)**: `currentStep` + `fired` advanced (looked alive) while analyser level = `0.000` (silent); root cause was a StrictMode register/destroy lifecycle bug severing the output. Adding an output-level meter (peak-hold, under `--mute-audio`) caught it and confirmed the fix (`0.04–0.49`). The user's "does it have sound?" was the only thing that surfaced it — every state proxy I had was green.

(One case → stays `raw`. This extends `[[browser-verify-audio-canvas-app-gotchas]]` / the shape browser-verify-gotchas audio section, which covers mute + user-activation but **not** "assert on measured output, because state proxies decouple from sound." Trip-wire to promote + fold into the gotchas: a second audio browser-verify where a non-output proxy reads green while the output is silent.)
</content>
