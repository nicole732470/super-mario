#!/usr/bin/env python3
"""Render Sprout.app icon PNG + ICNS for macOS."""

from __future__ import annotations

import math
import os
import subprocess
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILD = os.path.join(ROOT, "build")
SIZE = 1024


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def sky_pixel(x: int, y: int) -> tuple[int, int, int]:
    t = y / SIZE
    r = int(lerp(201, 244, t))
    g = int(lerp(218, 247, t))
    b = int(lerp(240, 250, t))
    return r, g, b


def draw_cloud(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float, fill: tuple[int, int, int, int]) -> None:
    for ox, oy, rx, ry in [
        (0, 0, 70, 34),
        (-58, 10, 48, 28),
        (58, 8, 52, 30),
        (-24, -16, 40, 26),
        (30, -14, 44, 28),
    ]:
        draw.ellipse(
            (cx + ox - rx * scale, cy + oy - ry * scale, cx + ox + rx * scale, cy + oy + ry * scale),
            fill=fill,
        )


def draw_flag(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rectangle((x, y, x + 8, y + 92), fill=(210, 214, 220))
    draw.rectangle((x - 2, y - 8, x + 12, y + 2), fill=(180, 186, 196))
    draw.rectangle((x + 8, y + 4, x + 58, y + 34), fill=(34, 197, 94))
    draw.rectangle((x + 8, y + 4, x + 58, y + 16), fill=(74, 222, 128))


def draw_hero(draw: ImageDraw.ImageDraw, x: int, y: int, shirt: tuple[int, int, int], hat: tuple[int, int, int]) -> None:
    draw.rectangle((x + 10, y + 8, x + 38, y + 22), fill=hat)
    draw.rectangle((x + 12, y + 22, x + 36, y + 34), fill=(255, 214, 170))
    draw.rectangle((x + 8, y + 34, x + 40, y + 58), fill=shirt)
    draw.rectangle((x + 4, y + 36, x + 14, y + 52), fill=shirt)
    draw.rectangle((x + 34, y + 36, x + 44, y + 52), fill=shirt)
    draw.rectangle((x + 10, y + 58, x + 20, y + 72), fill=(55, 65, 81))
    draw.rectangle((x + 28, y + 58, x + 38, y + 72), fill=(55, 65, 81))


def render_icon() -> Image.Image:
    img = Image.new("RGBA", (SIZE, SIZE))
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            r, g, b = sky_pixel(x, y)
            px[x, y] = (r, g, b, 255)

    draw = ImageDraw.Draw(img, "RGBA")
    draw_cloud(draw, 250, 220, 1.0, (255, 255, 255, 210))
    draw_cloud(draw, 760, 280, 0.85, (255, 255, 255, 180))
    draw_cloud(draw, 520, 170, 0.65, (255, 255, 255, 150))

    ground_y = 700
    for i in range(9):
        gx = 170 + i * 78
        draw.rounded_rectangle((gx, ground_y, gx + 70, ground_y + 28), radius=6, fill=(180, 83, 9))
        draw.rectangle((gx + 4, ground_y + 4, gx + 34, ground_y + 24), fill=(217, 119, 6))
        draw.rectangle((gx + 36, ground_y + 4, gx + 66, ground_y + 24), fill=(194, 65, 12))

    draw.rounded_rectangle((150, ground_y + 28, 874, ground_y + 44), radius=8, fill=(0, 0, 0, 35))
    draw_hero(draw, 300, ground_y - 74, (34, 197, 94), (22, 163, 74))
    draw_hero(draw, 560, ground_y - 74, (239, 68, 68), (220, 38, 38))
    draw_flag(draw, 790, ground_y - 98)

    # subtle sprout mark top-left for brand
    draw.ellipse((118, 118, 178, 178), fill=(255, 255, 255, 220))
    draw.polygon([(148, 132), (160, 168), (136, 168)], fill=(34, 197, 94))
    draw.rectangle((152, 168, 158, 186), fill=(120, 113, 108))

    return img


def write_icns(png_path: str, icns_path: str) -> None:
    iconset = os.path.join(BUILD, "icon.iconset")
    os.makedirs(iconset, exist_ok=True)
    sizes = [16, 32, 64, 128, 256, 512, 1024]
    src = Image.open(png_path).convert("RGBA")
    for size in sizes:
        resized = src.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(iconset, f"icon_{size}x{size}.png"))
        if size <= 512:
            dsize = size * 2
            dresized = src.resize((dsize, dsize), Image.Resampling.LANCZOS)
            dresized.save(os.path.join(iconset, f"icon_{size}x{size}@2x.png"))
    subprocess.run(["iconutil", "-c", "icns", iconset, "-o", icns_path], check=True)


def main() -> int:
    os.makedirs(BUILD, exist_ok=True)
    png_path = os.path.join(BUILD, "icon.png")
    icns_path = os.path.join(BUILD, "icon.icns")
    render_icon().save(png_path)
    write_icns(png_path, icns_path)
    print(f"Wrote {png_path}")
    print(f"Wrote {icns_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
