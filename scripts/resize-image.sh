#!/usr/bin/env bash
# Usage: scripts/resize-image.sh <image> [WxH]
# Shrinks <image> in place so it still covers WxH (default 1500x900, the largest
# .Fill in layouts/_default/single.html), converts to sRGB, strips metadata.
set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "usage: $0 <image> [WxH]" >&2
  exit 1
fi

img=$1
size=${2:-1500x900}
tmp=$(mktemp --suffix=".${img##*.}")
trap 'rm -f "$tmp"' EXIT

before=$(du -h "$img" | cut -f1)

magick "$img" \
  -auto-orient \
  -colorspace sRGB \
  -resize "${size}^>" \
  -strip \
  -interlace Plane \
  -sampling-factor 4:2:0 \
  -quality 85 \
  "$tmp"

mv "$tmp" "$img"
trap - EXIT

echo "$img: $before -> $(du -h "$img" | cut -f1), $(magick identify -format '%wx%h' "$img")"
