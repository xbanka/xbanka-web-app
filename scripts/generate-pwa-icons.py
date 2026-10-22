#!/usr/bin/env python3
"""
Regenerates the PWA / home-screen icons from the XBanka "X" mark.

The mark is drawn as polygons (traced from public/xbanka_logo.png) and
supersampled, so the output is crisp instead of an upscaled 64px favicon.

Outputs:
  public/icons/icon-192.png            purpose "any"
  public/icons/icon-512.png            purpose "any"
  public/icons/icon-maskable-512.png   purpose "maskable" (mark inside the 80% safe zone)
  app/apple-icon.png                   180x180, opaque (iOS ignores transparency)

Run:  python3 scripts/generate-pwa-icons.py     (needs Pillow)
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
BG = (18, 19, 21, 255)  # --background in dark theme (#121315), matches manifest background_color
SS = 4  # supersampling factor

# Mark geometry in a 475 x 333 box (x 20..495, y 75..408 of the traced view).
BOX_X, BOX_Y, BOX_W, BOX_H = 20, 75, 475, 333
TL = [(50, 78), (165, 78), (250, 162), (175, 236)]
TR = [(345, 78), (495, 78), (335, 236), (175, 236)]
BL = [(x, 484 - y) for x, y in TL]
BR = [(x, 484 - y) for x, y in TR]

FLAT = (0, 238, 207, 255)
SHADE_OUTER = (26, 231, 216)
SHADE_INNER = (0, 183, 169)


def gradient(size, polygon_bbox_x, flip):
    """Horizontal outer->inner gradient across the left pieces."""
    w, h = size
    x0, x1 = polygon_bbox_x
    img = Image.new("RGBA", size)
    px = img.load()
    for x in range(w):
        t = min(max((x - x0) / max(x1 - x0, 1), 0), 1)
        c = tuple(round(SHADE_OUTER[i] + (SHADE_INNER[i] - SHADE_OUTER[i]) * t) for i in range(3))
        for y in range(h):
            px[x, y] = (*c, 255)
    return img


def draw_mark(canvas_px, mark_fraction):
    """Return an RGBA layer (canvas_px square) with the mark centred, mark_fraction wide."""
    n = canvas_px * SS
    scale = (n * mark_fraction) / BOX_W
    ox = (n - BOX_W * scale) / 2
    oy = (n - BOX_H * scale) / 2

    def pts(poly):
        return [((x - BOX_X) * scale + ox, (y - BOX_Y) * scale + oy) for x, y in poly]

    layer = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    grad = gradient((n, n), (ox, ox + BOX_W * scale * 0.55), False)
    for poly in (TL, BL):
        m = Image.new("L", (n, n), 0)
        ImageDraw.Draw(m).polygon(pts(poly), fill=255)
        layer.paste(grad, (0, 0), m)
    flat = Image.new("RGBA", (n, n), FLAT)
    for poly in (TR, BR):
        m = Image.new("L", (n, n), 0)
        ImageDraw.Draw(m).polygon(pts(poly), fill=255)
        layer.paste(flat, (0, 0), m)
    return layer


def render(canvas_px, mark_fraction, path):
    bg = Image.new("RGBA", (canvas_px * SS, canvas_px * SS), BG)
    bg.alpha_composite(draw_mark(canvas_px, mark_fraction))
    out = bg.resize((canvas_px, canvas_px), Image.LANCZOS).convert("RGB")
    path.parent.mkdir(parents=True, exist_ok=True)
    out.save(path, optimize=True)
    print(f"wrote {path.relative_to(ROOT)} ({canvas_px}x{canvas_px})")


if __name__ == "__main__":
    render(192, 0.66, ROOT / "public/icons/icon-192.png")
    render(512, 0.66, ROOT / "public/icons/icon-512.png")
    # Maskable: platforms crop to a circle/squircle; keep the mark within the central 80%.
    render(512, 0.52, ROOT / "public/icons/icon-maskable-512.png")
    render(180, 0.62, ROOT / "app/apple-icon.png")
