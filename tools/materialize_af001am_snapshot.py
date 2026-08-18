#!/usr/bin/env python3
from pathlib import Path
import shutil, zipfile

ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / 'packs' / 'AF001AM' / 'HNK_AFTERWORLD_AF-001AM_DynamicSkyWeatherWorldAtmosphere_v0.1.zip'
TARGET = ROOT / '_materialized' / 'AF001AM'

if TARGET.exists():
    shutil.rmtree(TARGET)
TARGET.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(PACK) as z:
    z.extractall(TARGET)
print(f'Tehkné Solutions: materialized AF-001AM snapshot at {TARGET}')
