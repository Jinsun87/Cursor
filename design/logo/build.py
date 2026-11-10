"""Renders every logo file from mark.svg with headless Chrome. Run: python design/logo/build.py"""
import os, subprocess, pathlib
HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / "out"; OUT.mkdir(exist_ok=True)
TMP = HERE / "out" / "_html"; TMP.mkdir(exist_ok=True)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MARK = (HERE / "mark.svg").read_text(encoding="utf8")
FONTS = '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Newsreader:opsz,wght@6..72,500&display=block" rel="stylesheet">'
BG = "#0c0a09"

def mark(size):
    return MARK.replace("<svg ", f'<svg width="{size}" height="{size}" ', 1)

def lockup(h, tag=True):
    """Mark beside the name; h is the mark height in px."""
    return f'''<div style="display:flex;align-items:center;gap:{h*0.12:.0f}px">{mark(h)}
      <div><div style="font-family:'Cormorant Garamond';font-weight:600;font-size:{h*0.46:.0f}px;line-height:1;color:#f1ebdd">Lampstand</div>
      {f'<div style="font-family:Newsreader;font-size:{h*0.115:.0f}px;color:#e4c04a;letter-spacing:.2em;margin-top:{h*0.06:.0f}px">THE BIBLE, READ ALOUD</div>' if tag else ''}</div></div>'''

def page(w, h, body, bg=BG, glow=False):
    g = f"background:radial-gradient(ellipse at 50% 45%, rgba(228,167,58,.10), transparent 60%), {bg};" if glow else f"background:{bg};"
    return f'''<!doctype html><html><head><meta charset="utf-8">{FONTS}<style>html,body{{margin:0;width:{w}px;height:{h}px;overflow:hidden}}
    body{{{g}display:flex;align-items:center;justify-content:center}}</style></head><body>{body}</body></html>'''

def render(name, w, h, html, transparent=False):
    f = TMP / f"{name}.html"; f.write_text(html, encoding="utf8")
    args = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=5000",
            f"--window-size={w},{h}", f"--screenshot={OUT / name}", f.as_uri()]
    if transparent: args.insert(2, "--default-background-color=00000000")
    subprocess.run(args, capture_output=True)
    print(name)

for n in (512, 192):
    render(f"icon-{n}.png", n, n, page(n, n, mark(round(n * 0.8))))
render("apple-touch-icon.png", 180, 180, page(180, 180, mark(146)))
render("icon-maskable-512.png", 512, 512, page(512, 512, mark(330)))
render("profile-1080.png", 1080, 1080, page(1080, 1080, mark(820)))
render("youtube-banner-2560x1440.png", 2560, 1440, page(2560, 1440, lockup(360), glow=True))
render("facebook-cover-1640x624.png", 1640, 624, page(1640, 624, lockup(300), glow=True))
render("x-header-1500x500.png", 1500, 500, page(1500, 500, lockup(260), glow=True))
render("logo-wide-dark-1600x500.png", 1600, 500, page(1600, 500, lockup(330)))
render("logo-wide-transparent-1600x500.png", 1600, 500, page(1600, 500, lockup(330), bg="transparent"), transparent=True)

# The browser-tab icon: the mark on a rounded dark square, as SVG so it stays sharp.
inner = MARK.split(">", 1)[1].rsplit("</svg>", 1)[0]
(OUT / "icon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="130 105 764 764">'
    f'<rect x="130" y="105" width="764" height="764" rx="150" fill="{BG}"/>{inner}</svg>\n', encoding="utf8")
print("icon.svg")
