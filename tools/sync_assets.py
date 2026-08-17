#!/usr/bin/env python3
from pathlib import Path
import shutil, sys

SIGNATURE = "Tehkné Solutions"

if len(sys.argv) != 2:
    raise SystemExit("usage: python tools/sync_assets.py <hnk-rpg-game-assets checkout>")

repo = Path(sys.argv[1]).resolve()
src = repo / "runtime" / "web" / "assets"
dst = Path(__file__).resolve().parents[1] / "web" / "assets"
if not src.exists():
    raise SystemExit(f"asset runtime not found: {src}")
if dst.exists():
    shutil.rmtree(dst)
shutil.copytree(src, dst)
print(f"{SIGNATURE}: synchronized {sum(1 for p in dst.rglob('*') if p.is_file())} runtime asset files")
