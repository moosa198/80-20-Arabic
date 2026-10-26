#!/usr/bin/env python3
"""Build exact, unaltered FSTU page excerpts for the 31-week course.

The source PDFs are downloaded from Al-Qalam Institute's public, official
Google Drive resources during CI. Only pages assigned in weekly-guide.js are
included in the published excerpt PDFs. Original page artwork and wording are
not annotated or edited. The app displays each lesson's assigned page only.
"""
from __future__ import annotations
import html
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)

PAGE_MAP = {
    "nahw": [8, 12, 20, 21, 27, 34, 36, 38, 41, 47, 48, 49, 50, 52, 53, 54, 56, 57, 65, 69, 72, 84, 95, 99, 117, 127, 137, 139, 150],
    "sarf": [16, 17, 19, 24, 42, 43, 57, 58, 60, 65, 68, 70, 72],
}
SOURCES = {
    "nahw": {
        "id": "1BdY0tAvoaKvJVUhmMQn09bxLh0fAXO03",
        "filename": "fstu-nahw-source.pdf",
        "output": "fstu-nahw-extracts.pdf",
        "official_url": "https://www.alqalaminstitute.org/resources/nahw-resources/fstu-nahw-resources",
        "edition": "FSTU Naḥw, August 2026 resource",
    },
    "sarf": {
        "id": "1D4Sr_0iz8fywSmPMB1H9iM1a4FOU7tzr",
        "filename": "fstu-sarf-source.pdf",
        "output": "fstu-sarf-extracts.pdf",
        "official_url": "https://www.alqalaminstitute.org/resources/sarf-resources/fstu-sarf-resources",
        "edition": "FSTU Ṣarf, October 2023 resource",
    },
}

def download_drive(file_id: str, destination: Path) -> None:
    """Download a public Drive file, handling its optional confirmation page."""
    base = "https://drive.google.com/uc?" + urllib.parse.urlencode({"export": "download", "id": file_id})
    headers = {"User-Agent": "Mozilla/5.0 (compatible; 8020ArabicCourseBuilder/1.0)"}
    request = urllib.request.Request(base, headers=headers)
    with urllib.request.urlopen(request, timeout=90) as response:
        content = response.read()
    if not content.startswith(b"%PDF-"):
        page = content.decode("utf-8", "ignore")
        match = re.search(r"confirm=([A-Za-z0-9_-]+)", page)
        if not match:
            match = re.search('name="confirm"\\s+value="([^"]+)"', page)
        token = match.group(1) if match else "t"
        retry_url = base + "&confirm=" + urllib.parse.quote(token)
        request = urllib.request.Request(retry_url, headers=headers)
        with urllib.request.urlopen(request, timeout=90) as response:
            content = response.read()
    if not content.startswith(b"%PDF-"):
        raise RuntimeError(f"Google Drive did not return a PDF for source id {file_id}; received {content[:80]!r}")
    destination.write_bytes(content)

def main() -> None:
    try:
        from pypdf import PdfReader, PdfWriter
    except ImportError as exc:
        raise SystemExit("Install pypdf before running this script: python -m pip install pypdf") from exc

    for key, spec in SOURCES.items():
        tmp = ROOT / ".fstu-source-downloads"
        tmp.mkdir(exist_ok=True)
        source = tmp / spec["filename"]
        print(f"Downloading {spec['edition']} from the official source…", flush=True)
        download_drive(spec["id"], source)
        reader = PdfReader(str(source))
        pages = PAGE_MAP[key]
        if not pages or max(pages) > len(reader.pages):
            raise RuntimeError(f"Invalid page mapping for {key}: source has {len(reader.pages)} pages; requested {pages}")
        writer = PdfWriter()
        for printed_page in pages:
            # In the supplied FSTU editions the printed page number is the PDF page index.
            writer.add_page(reader.pages[printed_page - 1])
        target = ASSETS / spec["output"]
        with target.open("wb") as out:
            writer.write(out)
        result = PdfReader(str(target))
        if len(result.pages) != len(pages):
            raise RuntimeError(f"Extract verification failed for {target.name}: {len(result.pages)} != {len(pages)}")
        print(f"Built {target.relative_to(ROOT)} with {len(result.pages)} exact source pages ({target.stat().st_size:,} bytes)", flush=True)

    manifest = {
        "schemaVersion": 1,
        "sourceNotice": "Selected, unaltered pages from official Al-Qalam Institute FSTU resources. For educational/non-commercial teaching use with attribution. No original full textbook is included.",
        "pages": PAGE_MAP,
        "sources": {
            key: {
                "title": SOURCES[key]["edition"],
                "url": SOURCES[key]["official_url"],
                "fileId": SOURCES[key]["id"],
            }
            for key in SOURCES
        },
    }
    (ASSETS / "fstu-page-map.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Wrote assets/fstu-page-map.json", flush=True)

if __name__ == "__main__":
    main()
