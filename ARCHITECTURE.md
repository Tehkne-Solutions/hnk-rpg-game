# HNK: AFTERWORLD — Runtime Architecture

**Tehkné Solutions**

## Canonical repositories

- `Tehkne-Solutions/hnk-rpg-game`: game/runtime, simulation, tests and Web-first CI.
- `Tehkne-Solutions/hnk-rpg-game-assets`: GLB assets, regional layouts, biome manifests and asset lineage.

## Runtime model

The world state is independent from rendering. The browser represents a subset of a persistent simulation composed of relationship memory, ecology, time, resources, populations, regions, deterministic events, travel and regional streaming.

The current frontier is AF-001AC: North Woodland contains 667 logical objects while an adaptive visibility budget targets 55 FPS and limits rendered vegetation before sacrificing landmarks or interactive entities.

## Asset boundary

`web/assets/` is a generated runtime mirror and is not source-of-truth. Run `python tools/sync_assets.py <path-to-hnk-rpg-game-assets>` to materialize assets from the canonical asset repository.
