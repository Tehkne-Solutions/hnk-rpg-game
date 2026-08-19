# HNK: AFTERWORLD — Canonical Frontier

**Tehkné Solutions**

Current Assets Forge frontier: **AF-001CE — Worker Schedules, Needs & Autonomous Settlement Operations Runtime**.

AF-001CE extends AF-001CD worker jobs with simulation-time hunger, fatigue and rest, authored work shifts, availability rules and autonomous action selection between eating, resting, working and idling. Normal jobs remain capability-gated and off-shift workers do not accept work unless a later emergency policy explicitly overrides.

AF-001CD compatibility remains preserved.

Completion rule remains paired: an AF is complete only after runtime is published in `hnk-rpg-game` and asset/data status is published in `hnk-rpg-game-assets`.
