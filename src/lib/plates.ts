import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type Plate = { src: string; width: number; height: number };

/**
 * The intrinsic size of a picture under public/, read straight from its file
 * header — no decoding, no extra dependency. Handing these to a frame lets it
 * take each picture's own shape instead of forcing every one into a single
 * ratio and cropping the difference away.
 *
 * Server-only: keep this out of anything a client component imports.
 */
export function readPlates(sources: string[]): Plate[] {
  return sources
    .map((src) => {
      const file = join(process.cwd(), "public", src);
      if (!existsSync(file)) return null;

      const size = measure(readFileSync(file));
      return size ? { src, ...size } : null;
    })
    .filter((plate): plate is Plate => plate !== null);
}

function measure(bytes: Buffer) {
  // PNG: the IHDR chunk opens the file, width and height at a fixed offset.
  if (bytes.subarray(0, 4).toString("hex") === "89504e47") {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }

  // JPEG: walk the segments until a start-of-frame carries the dimensions.
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let at = 2;

    while (at < bytes.length - 9) {
      if (bytes[at] !== 0xff) {
        at += 1;
        continue;
      }

      const marker = bytes[at + 1];
      const isFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker);

      if (isFrame) {
        return {
          width: bytes.readUInt16BE(at + 7),
          height: bytes.readUInt16BE(at + 5),
        };
      }

      at += 2 + bytes.readUInt16BE(at + 2);
    }
  }

  return null;
}
