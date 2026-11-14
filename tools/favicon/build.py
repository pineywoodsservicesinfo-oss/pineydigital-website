#!/usr/bin/env python3
"""Rebuild favicon.svg, favicon.ico and the PNG icons from the pine mark."""
import glob, os, subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent
BUILD = Path(__file__).resolve().parent / '_build'
BUILD.mkdir(exist_ok=True)
TREE = 'M12 3l5 6h-3l4 5h-4l3 4H7l3-4H6l4-5H7l5-6z'
INK = '#818cf8'
STROKE = 1.7

def svg(size=None, bg=None, pad=0, stroke=None):
    # Outline version, same as the nav logo: traced edge, hollow inside.
    # viewBox is square around the tree; pad widens it for icons that need breathing room.
    v = 20 + pad * 2
    o = 2 - pad
    rect = f'<rect x="{o}" y="{o}" width="{v}" height="{v}" rx="{v*0.22:.2f}" fill="{bg}" stroke="none"/>' if bg else ''
    dims = f' width="{size}" height="{size}"' if size else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg"{dims} viewBox="{o} {o} {v} {v}" fill="none" stroke="{INK}" '
            f'stroke-width="{stroke or STROKE}" stroke-linecap="round" stroke-linejoin="round">{rect}'
            f'<path d="{TREE}"/><path d="M12 18v3.2"/></svg>')

def chrome():
    for pat in ('~/.cache/puppeteer/chrome-headless-shell/*/*/chrome-headless-shell',
                '~/.cache/hyperframes/chrome/chrome-headless-shell/*/*/chrome-headless-shell'):
        hits = sorted(glob.glob(os.path.expanduser(pat)))
        if hits:
            return hits[-1]
    raise SystemExit('No headless Chrome found')

def render(name, size, bg=None, pad=0, solid=None, stroke=None):
    html = BUILD / f'{name}.html'
    body = f'<body style="margin:0;background:{solid or "transparent"}">{svg(size, bg, pad, stroke)}</body>'
    html.write_text('<!doctype html><meta charset="utf-8">' + body)
    out = BUILD / f'{name}.png'
    subprocess.run([chrome(), '--no-sandbox', '--hide-scrollbars', '--default-background-color=00000000',
                    f'--window-size={size},{size}', f'--screenshot={out}', html.as_uri()],
                   check=True, capture_output=True)
    return Image.open(out).convert('RGBA')

# Vector favicon: transparent, indigo-400 reads on light and dark tab bars.
(ROOT / 'favicon.svg').write_text(svg(None, None, 0.6) + '\n')

render('f96', 96, pad=0.6).save(ROOT / 'favicon-96x96.png', optimize=True)
ico_src = [render(f'i{s}', s, pad=0.6, stroke=2.4 if s < 32 else 2.0) for s in (16, 32, 48)]
ico_src[2].save(ROOT / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico_src[:2])
# Home-screen icons must be opaque: dark tile matching the site.
for name, s, pad in (('apple-touch-icon.png', 180, 3.5), ('web-app-manifest-192x192.png', 192, 4.5), ('web-app-manifest-512x512.png', 512, 4.5)):
    img = render(name.split('.')[0], s, bg='#0a0a0f', pad=pad, solid='#0a0a0f').convert('RGB')
    img.save(ROOT / name, optimize=True)
print('done')
