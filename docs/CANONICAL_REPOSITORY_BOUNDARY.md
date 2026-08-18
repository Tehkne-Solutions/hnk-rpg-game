# Canonical repository boundary

**Tehkné Solutions**

- `Tehkne-Solutions/hnk-rpg-game` owns runtime, gameplay, simulation, streaming, Web renderer, tests and CI.
- `Tehkne-Solutions/hnk-rpg-game-assets` owns GLB/source visual assets, regional layouts, biome manifests and asset integrity indexes.

Current frontier: **AF-001AD**.

The game repository must not become a second source of truth for binary art. Asset materialization is a development/CI concern through `tools/sync_assets.py`.
