#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED = [
    "game/ProjectSettings/ProjectVersion.txt",
    "game/Assets/_Afterworld/Core/Tehkne.Afterworld.Core.asmdef",
    "game/Assets/_Afterworld/Simulation/Tehkne.Afterworld.Simulation.asmdef",
    "game/Assets/_Afterworld/Core/Runtime/EntityId.cs",
    "game/Assets/_Afterworld/Core/Runtime/WorldClock.cs",
    "game/Assets/_Afterworld/Core/Runtime/DeterministicRng.cs",
    "game/Assets/_Afterworld/Simulation/Runtime/WorldState.cs",
    "game/Assets/_Afterworld/Simulation/Runtime/WorldContracts.cs",
    "game/Assets/_Afterworld/Simulation/Runtime/FirstDaysGoldenWorld.cs",
    "schemas/save-v1.schema.json",
]

for relative in REQUIRED:
    path = ROOT / relative
    if not path.is_file():
        raise SystemExit(f"missing required bootstrap file: {relative}")

version = (ROOT / "game/ProjectSettings/ProjectVersion.txt").read_text(encoding="utf-8")
if "6000.3.17f1" not in version:
    raise SystemExit("Unity project is not pinned to 6000.3.17f1")

for relative in [
    "game/Assets/_Afterworld/Core/Tehkne.Afterworld.Core.asmdef",
    "game/Assets/_Afterworld/Simulation/Tehkne.Afterworld.Simulation.asmdef",
    "schemas/save-v1.schema.json",
]:
    with (ROOT / relative).open(encoding="utf-8") as handle:
        json.load(handle)

for package in ["Core", "Simulation"]:
    runtime = ROOT / f"game/Assets/_Afterworld/{package}/Runtime"
    for source in runtime.glob("*.cs"):
        text = source.read_text(encoding="utf-8")
        if "using UnityEngine" in text:
            raise SystemExit(f"simulation boundary violation: {source.relative_to(ROOT)} imports UnityEngine")

print("PASS M10-A0 bootstrap contracts")
