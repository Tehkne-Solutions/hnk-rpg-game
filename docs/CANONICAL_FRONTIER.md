# HNK: AFTERWORLD — Canonical Frontier

**Tehkné Solutions**

Current Assets Forge frontier: **AF-001CD — Worker Jobs, Pickup/Delivery Tasks & Settlement Work Orders Runtime**.

AF-001CD extends AF-001CC hauling with explicit worker-assigned world jobs. Assignment respects capability, priority, skill, fatigue and distance; delivery jobs reference real source/destination/item/quantity/equipment and advance through simulation time rather than completing instantly.

AF-001CC compatibility remains preserved.

Completion rule remains paired: an AF is complete only after runtime is published in `hnk-rpg-game` and asset/data status is published in `hnk-rpg-game-assets`.
