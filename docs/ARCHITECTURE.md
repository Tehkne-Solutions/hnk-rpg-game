# HNK: AFTERWORLD — Architecture Contract

Signature: Tehkné Solutions

## M10-A0

This repository hosts the authoritative game runtime, simulation core, Unity project, automated tests, web build pipeline, and technical documentation for HNK: AFTERWORLD.

### Architectural laws

1. Simulation state is authoritative; presentation renders state and never owns world truth.
2. GameObjects represent presence, not existence. Persistent entities survive scene unloads.
3. Stable EntityId values identify persistent entities across streaming and save/load.
4. Commands express intent; WorldEvents express facts that actually happened.
5. Knowledge, belief, memory, and relationship state are separate concepts.
6. Capabilities are derived from knowledge, skill, equipment, resources, and context; they are not persisted caches.
7. Save data is versioned from the first schema.
8. Core simulation must be executable headlessly and testable without rendering.
9. Content is data-driven; authored definitions are separate from runtime instances.
10. All product-facing signatures belong to Tehkné Solutions.

### M10-A0 gate

The bootstrap is accepted when code/test automation can create a deterministic world, advance world time, serialize/deserialize a versioned snapshot, and run without requiring a playable Unity scene.
