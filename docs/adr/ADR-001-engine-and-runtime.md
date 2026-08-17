# ADR-001 — Engine and Runtime

Status: Accepted

Signature: Tehkné Solutions

## Decision

HNK: AFTERWORLD uses Unity 6.3 LTS as the primary runtime/presentation engine. The bootstrap is pinned to editor `6000.3.17f1` until an explicit ADR changes the production pin.

The authoritative simulation core must remain as independent from `UnityEngine` as practical so it can be executed in automated/headless tests and can later be optimized without coupling world truth to scene objects.

## Consequences

- Unity scenes and GameObjects represent materialized presentation.
- Persistent simulation state is stored outside scene objects.
- Web is the primary rapid validation surface for the vertical slice.
- Editor operation should be automatable through CI wherever practical.
- Engine upgrades require an explicit ADR plus regression gates for simulation, save compatibility, web build, and presentation.
