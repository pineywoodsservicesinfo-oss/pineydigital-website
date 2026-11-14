#!/usr/bin/env python3
"""Render 1200x630 Open Graph cards for every page into images/og/.

Usage:  python3 tools/og/generate.py [slug ...]
Needs a headless Chrome (CHROME env var, or the puppeteer/hyperframes cache) and Pillow.
Blog post cards take their headline from each post's <title>, so a new post only needs
an entry added by running this script again.
"""
import html, os, re, subprocess, sys, glob
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = ROOT / 'images' / 'og'
BUILD = HERE / '_build'

PAGES = [
    # slug, tag, headline, sub, motif
    ('home', 'Custom software & websites', 'Custom software for Texas service businesses.', 'Built around your operation. You own the code.', 'console'),
    ('about', 'About', 'Joel Escoto, platform developer and founder.', 'Custom software and websites out of Lufkin, Texas.', 'console'),
    ('blog', 'Blog', 'Notes on building operational systems.', 'Practical insight for Texas service businesses.', 'posts'),
    ('capabilities', 'Capabilities', 'Custom software and AI automation.', 'Concept work for multi-location operations.', 'console'),
    ('faq', 'FAQ', 'Pricing, timelines and ownership, answered.', 'Straight answers before you start.', 'console'),
    ('pricing', 'Pricing', 'Transparent pricing for custom work.', 'Starter sites from $799. Platforms scoped to your operation.', 'console'),
    ('contact', 'Contact', 'Get a free 15-minute audit.', 'Tell me about your operation. Reply within 24 hours.', 'console'),
    ('services', 'Services', 'Websites, software, dashboards and integrations.', 'One partner for everything a multi-location business runs on.', 'console'),
    ('services-websites', 'Websites', 'Custom website development in Lufkin, TX.', 'Fast, search-ready sites that turn visitors into calls.', 'console'),
    ('locations-lufkin-nacogdoches', 'Local', 'Web design and custom software in Lufkin and Nacogdoches.', 'Built in East Texas, for East Texas businesses.', 'console'),
    ('privacy', 'Legal', 'Privacy policy.', 'How Piney Digital handles your information.', 'mark'),
    ('terms', 'Legal', 'Terms and conditions.', 'The ground rules for working together.', 'mark'),
    ('404', 'Not found', 'That page has moved on.', 'Head back to the homepage.', 'mark'),
]

PINE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l5 6h-3l4 5h-4l3 4H7l3-4H6l4-5H7l5-6z"/><path d="M12 18v3"/></svg>'

ROWS = [('Lufkin', 94), ('Tyler', 88), ('Conroe', 79), ('Nacogdoches', 74), ('Huntsville', 66), ('Livingston', 58)]
CONSOLE = '''<div class="console"><div class="bar"><span class="live"><i></i>Live</span><span>All locations</span></div>
<ul>{rows}</ul></div>'''
POSTS = '''<div class="console"><div class="bar"><span>Latest notes</span></div>
<ul class="lines">{rows}</ul></div>'''

TEMPLATE = '''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:SG;font-weight:700;src:url(../../fonts/space-grotesk-latin-700-normal.woff2)}}
@font-face{{font-family:SG;font-weight:500;src:url(../../fonts/space-grotesk-latin-500-normal.woff2)}}
@font-face{{font-family:IN;font-weight:400;src:url(../../fonts/inter-latin-400-normal.woff2)}}
@font-face{{font-family:IN;font-weight:500;src:url(../../fonts/inter-latin-500-normal.woff2)}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;background:#0a0a0f;overflow:hidden}}
body{{position:relative;font-family:IN,sans-serif;color:#fff}}
.bg{{position:absolute;inset:0;background:
 radial-gradient(55% 70% at 85% 45%,rgba(99,102,241,.26),transparent 70%),
 linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px) 0 0/60px 60px,
 linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px) 0 0/60px 60px;
 -webkit-mask-image:radial-gradient(ellipse 80% 90% at 70% 40%,#000 25%,transparent 80%)}}
.brand{{position:absolute;left:72px;top:60px;display:flex;align-items:center;gap:12px;font:700 26px SG;letter-spacing:-.01em}}
.brand svg{{width:34px;height:34px;color:#818cf8}}
.tag{{position:absolute;left:72px;top:150px;font:500 22px IN;color:#a5b4fc}}
h1{{font:700 {hs}px/1.04 SG;letter-spacing:-.035em}}
.copy{{position:absolute;left:72px;top:196px;width:{hw}px}}
.sub{{margin-top:28px;font:400 26px/1.4 IN;color:#c4c4d0}}
.url{{position:absolute;left:72px;bottom:44px;font:500 20px IN;color:#8b8b9a}}
.console{{position:absolute;right:-40px;top:130px;width:430px;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:#0d0d14;box-shadow:0 30px 60px -20px rgba(0,0,0,.6);overflow:hidden}}
.bar{{display:flex;gap:14px;align-items:center;padding:18px 24px;border-bottom:1px solid rgba(255,255,255,.09);font:500 17px IN;color:#a0a0ad}}
.live{{display:inline-flex;align-items:center;gap:8px;padding:4px 12px 4px 10px;border-radius:99px;background:rgba(52,211,153,.13);color:#6ee7b7}}
.live i{{width:8px;height:8px;border-radius:50%;background:#34d399}}
ul{{list-style:none;padding:10px 24px 14px}}
li{{display:grid;grid-template-columns:130px 1fr;gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07);font:400 18px IN;color:#ececf2}}
li:last-child{{border:0}}
li b{{display:block;height:9px;border-radius:9px;background:linear-gradient(90deg,#6366f1,#a5b4fc)}}
.lines li{{grid-template-columns:1fr;gap:10px;padding:18px 0}}
.lines li span{{display:block;height:9px;border-radius:9px;background:rgba(255,255,255,.1)}}
.lines li span:first-child{{height:12px;background:rgba(165,180,252,.55);width:70%}}
.mark{{position:absolute;right:110px;top:150px;width:330px;height:330px;color:#6366f1;opacity:.9}}
.mark svg{{width:100%;height:100%;stroke-width:.7}}
</style></head><body><div class="bg"></div>
<div class="brand">{pine}Piney Digital</div>
<div class="tag">{tag}</div>
<div class="copy"><h1>{title}</h1>
<div class="sub">{sub}</div></div>
<div class="url">pineydigital.com</div>
{motif}
</body></html>'''


def motif_html(kind):
    if kind == 'console':
        rows = ''.join(f'<li><span>{n}</span><b style="width:{w}%"></b></li>' for n, w in ROWS)
        return CONSOLE.format(rows=rows)
    if kind == 'posts':
        rows = ''.join('<li><span></span><span style="width:%d%%"></span><span style="width:%d%%"></span></li>' % (w, w - 25) for w in (95, 88, 92, 80))
        return POSTS.format(rows=rows)
    return f'<div class="mark">{PINE}</div>'


def blog_pages():
    out = []
    for p in sorted(glob.glob(str(ROOT / 'blog' / '*' / 'index.html'))):
        slug = Path(p).parent.name
        t = re.search(r'<title>([^<]*)</title>', Path(p).read_text()).group(1)
        t = html.unescape(re.sub(r'\s*\|\s*Piney Digital.*$', '', t)).strip()
        out.append((f'blog-{slug}', 'Blog', t, 'Piney Digital · Lufkin, Texas', 'posts'))
    return out


def chrome():
    if os.environ.get('CHROME'):
        return os.environ['CHROME']
    for pat in ('~/.cache/puppeteer/chrome-headless-shell/*/*/chrome-headless-shell',
                '~/.cache/hyperframes/chrome/chrome-headless-shell/*/*/chrome-headless-shell'):
        hits = sorted(glob.glob(os.path.expanduser(pat)))
        if hits:
            return hits[-1]
    sys.exit('No headless Chrome found. Set CHROME=/path/to/chrome-headless-shell')


def main():
    only = set(sys.argv[1:])
    OUT.mkdir(parents=True, exist_ok=True)
    (BUILD / 'pages').mkdir(parents=True, exist_ok=True)
    exe = chrome()
    for slug, tag, title, sub, kind in PAGES + blog_pages():
        if only and slug not in only:
            continue
        n = len(title)
        hs = 72 if n <= 40 else 60 if n <= 62 else 50
        hw = 640 if kind != 'mark' else 760
        src = BUILD / 'pages' / f'{slug}.html'
        src.write_text(TEMPLATE.format(pine=PINE, tag=html.escape(tag), title=html.escape(title), sub=html.escape(sub),
                                       motif=motif_html(kind), hs=hs, hw=hw))
        raw = BUILD / f'{slug}.png'
        subprocess.run([exe, '--no-sandbox', '--hide-scrollbars', '--allow-file-access-from-files',
                        '--window-size=1200,630', '--virtual-time-budget=3000',
                        f'--screenshot={raw}', src.as_uri()], check=True, capture_output=True)
        img = Image.open(raw).convert('RGB')
        img.save(OUT / f'og-{slug}.png', optimize=True)
        print('wrote', OUT / f'og-{slug}.png', (OUT / f'og-{slug}.png').stat().st_size // 1024, 'KB')


if __name__ == '__main__':
    main()
