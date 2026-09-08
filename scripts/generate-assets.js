// scripts/generate-assets.js
// Generates clean, crisp starter PNG assets for the campaign
import fs from "fs";
import path from "path";
import zlib from "zlib";

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type);
  const crcBuf = Buffer.concat([t, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcBuf), 0);
  return Buffer.concat([len, t, data, crcVal]);
}

function createRGBA_PNG(width, height, drawFn) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Color type 6: RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk("IHDR", ihdrData);

  const rawRowLen = 1 + width * 4;
  const rawData = Buffer.alloc(rawRowLen * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rawRowLen;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a !== undefined ? a : 255;
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk("IDAT", compressed);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// 1. Logo: YLY
function drawYLY(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outer glow and border
  if (dist > w * 0.48) return [0, 0, 0, 0];
  if (dist > w * 0.45) return [59, 130, 246, 255]; // blue ring
  if (dist > w * 0.43) return [250, 204, 21, 255]; // gold ring

  // Cosmic dark blue circle background
  const bgR = 10 + Math.floor((x / w) * 15);
  const bgG = 25 + Math.floor((y / h) * 20);
  const bgB = 60 + Math.floor((dist / (w * 0.5)) * 40);

  // Central 'YLY' stylized shapes
  // Left wing (Y)
  if (Math.abs(dx + 25) < 8 && dy > -30 && dy < 15) return [255, 255, 255, 255];
  if (Math.abs(dx + 25 + dy * 0.5) < 6 && dy < -5 && dy > -45) return [250, 204, 21, 255];
  if (Math.abs(dx + 25 - dy * 0.5) < 6 && dy < -5 && dy > -45) return [250, 204, 21, 255];

  // Middle L shape
  if (Math.abs(dx) < 7 && dy > -35 && dy < 25) return [59, 130, 246, 255];
  if (Math.abs(dy - 20) < 6 && dx >= 0 && dx < 28) return [59, 130, 246, 255];

  // Right Y shape
  if (Math.abs(dx - 30) < 8 && dy > -30 && dy < 15) return [255, 255, 255, 255];
  if (Math.abs(dx - 30 + dy * 0.5) < 6 && dy < -5 && dy > -45) return [250, 204, 21, 255];
  if (Math.abs(dx - 30 - dy * 0.5) < 6 && dy < -5 && dy > -45) return [250, 204, 21, 255];

  // Subtle stars
  if ((x * 17 + y * 23) % 97 === 0) return [255, 255, 255, 220];

  return [bgR, bgG, bgB, 255];
}

// 2. Logo: 5in1
function draw5in1(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > w * 0.48) return [0, 0, 0, 0];
  if (dist > w * 0.45) return [234, 179, 8, 255]; // Gold ring
  if (dist > w * 0.42) return [15, 23, 42, 255];

  const bgR = 12;
  const bgG = 30 + Math.floor((1 - dist / (w * 0.5)) * 25);
  const bgB = 75;

  // Draw stylized "5" on left
  if (Math.abs(dy + 25) < 6 && dx > -45 && dx < -15) return [250, 204, 21, 255];
  if (Math.abs(dx + 40) < 6 && dy > -25 && dy < 0) return [250, 204, 21, 255];
  if (Math.abs(dy) < 6 && dx > -45 && dx < -15) return [250, 204, 21, 255];
  if (Math.abs(dx - (-15)) < 6 && dy > 0 && dy < 25) return [250, 204, 21, 255];
  if (Math.abs(dy - 25) < 6 && dx > -45 && dx < -15) return [250, 204, 21, 255];

  // Draw "1" on right
  if (Math.abs(dx - 30) < 6 && dy > -25 && dy < 25) return [255, 255, 255, 255];
  if (Math.abs(dx - 30 + dy * 0.6) < 5 && dy > -25 && dy < -10 && dx < 30) return [255, 255, 255, 255];

  // Central dot / star
  if (Math.abs(dx - 5) < 5 && Math.abs(dy) < 5) return [56, 189, 248, 255];

  return [bgR, bgG, bgB, 255];
}

// 3. Logo: Ministry
function drawMinistry(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > w * 0.48) return [0, 0, 0, 0];
  if (dist > w * 0.44) return [202, 138, 4, 255]; // Egyptian gold

  // Egyptian Flag bands behind eagle
  if (dy < -20) return [185, 28, 28, 255]; // Red band
  if (dy > 20) return [15, 23, 42, 255]; // Black band

  // White middle band
  const bgR = 245;
  const bgG = 245;
  const bgB = 250;

  // Golden Eagle in center
  if (Math.abs(dx) < 18 && Math.abs(dy) < 22) return [161, 98, 7, 255];
  if (Math.abs(dx) < 30 && dy > -10 && dy < 15 && Math.abs(dy) < (35 - Math.abs(dx))) return [202, 138, 4, 255]; // Wings

  return [bgR, bgG, bgB, 255];
}

// 4. Hero: Belo Mascot
function drawBelo(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2 + 10;
  const dx = x - cx;
  const dy = y - cy;

  // Cosmic outer aura
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > w * 0.48) return [0, 0, 0, 0];

  // Aura glow
  if (dist > w * 0.42) {
    const alpha = Math.floor((1 - (dist - w * 0.42) / (w * 0.06)) * 180);
    return [59, 130, 246, Math.max(0, alpha)];
  }

  // Head circle (big friendly cute mascot head)
  const headDist = Math.sqrt(dx * dx + (dy + 20) * (dy + 20));
  if (headDist < 75) {
    // Face shading - bright friendly cyan/blue
    let r = 56, g = 189, b = 248;
    // Cheeks blush
    if (Math.abs(dy + 15) < 12 && (Math.abs(dx - 35) < 14 || Math.abs(dx + 35) < 14)) {
      return [244, 114, 182, 255];
    }
    // Big expressive eyes
    const leftEye = Math.sqrt((dx + 25) * (dx + 25) + (dy + 30) * (dy + 30));
    const rightEye = Math.sqrt((dx - 25) * (dx - 25) + (dy + 30) * (dy + 30));
    if (leftEye < 14 || rightEye < 14) {
      if (leftEye < 5 || rightEye < 5) return [255, 255, 255, 255]; // eye sparkle
      return [15, 23, 42, 255]; // pupil
    }
    // Broad happy smile
    if (dy > -10 && dy < 8 && Math.abs(dx) < 25 && (dy > -10 + (dx * dx) / 70)) {
      return [15, 23, 42, 255]; // mouth
    }
    // Mascot golden star forehead badge
    if (Math.abs(dx) < 10 && dy < -50 && dy > -72) return [250, 204, 21, 255];

    return [r, g, b, 255];
  }

  // Mascot blue cosmic suit / body
  if (dy >= 40 && dy < 120 && Math.abs(dx) < 65 - (dy - 40) * 0.2) {
    // Golden YLY medallion on chest
    if (Math.abs(dx) < 16 && Math.abs(dy - 65) < 16) return [250, 204, 21, 255];
    return [30, 58, 138, 255]; // Deep navy suit
  }

  // Thumbs up / waved arm
  if (dx > 45 && dx < 85 && dy > 10 && dy < 55) {
    return [56, 189, 248, 255];
  }

  // Starry cosmic background
  const bgR = 10 + Math.floor(Math.sin(x * 0.05) * 6);
  const bgG = 20 + Math.floor(Math.cos(y * 0.05) * 8);
  const bgB = 50 + Math.floor((y / h) * 30);
  if ((x * 31 + y * 47) % 89 === 0) return [255, 255, 255, 240];

  return [bgR, bgG, bgB, 255];
}

// 5. Hero: Character (Henedy Comedy Hero)
function drawHeroCharacter(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > w * 0.48) return [0, 0, 0, 0];

  // Golden / Blue comic glow border
  if (dist > w * 0.44) return [245, 158, 11, 255];

  // Head: Khalaf style with shades
  const headDist = Math.sqrt(dx * dx + (dy + 35) * (dy + 35));
  if (headDist < 60) {
    // Sunglasses
    if (Math.abs(dy + 35) < 10 && Math.abs(dx) < 38) return [15, 23, 42, 255];
    // Big comedy grin
    if (dy > -15 && dy < 0 && Math.abs(dx) < 22 && (dy > -15 + (dx * dx) / 50)) return [255, 255, 255, 255];
    // Skin tone
    return [245, 180, 130, 255];
  }

  // Famous yellow suit jacket!
  if (dy >= 10 && dy < 125 && Math.abs(dx) < 75) {
    // Red tie
    if (Math.abs(dx) < 10 && dy < 90) return [220, 38, 38, 255];
    // White shirt collar
    if (Math.abs(dx) < 22 && dy < 35) return [255, 255, 255, 255];
    // Bright yellow suit
    return [234, 179, 8, 255];
  }

  // Cosmic dark navy background
  const bgR = 15;
  const bgG = 25;
  const bgB = 65;
  if ((x * 19 + y * 29) % 79 === 0) return [255, 255, 255, 255];

  return [bgR, bgG, bgB, 255];
}

// 6. Character 01: Khalaf El-Dahshoury
function drawCharacter01(x, y, w, h) {
  return drawHeroCharacter(x, y, w, h);
}

// 7. Character 02: Mohy El-Sharkawy
function drawCharacter02(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > w * 0.48) return [0, 0, 0, 0];
  if (dist > w * 0.44) return [239, 68, 68, 255]; // Red border for martial arts

  // Head
  const headDist = Math.sqrt(dx * dx + (dy + 35) * (dy + 35));
  if (headDist < 60) {
    // Hilarious startled expression
    const leftEye = Math.sqrt((dx + 18) * (dx + 18) + (dy + 40) * (dy + 40));
    const rightEye = Math.sqrt((dx - 18) * (dx - 18) + (dy + 40) * (dy + 40));
    if (leftEye < 9 || rightEye < 9) return [15, 23, 42, 255];
    // Open funny mouth
    if (Math.abs(dx) < 14 && dy > -15 && dy < 5) return [153, 27, 27, 255];
    return [245, 185, 135, 255];
  }

  // Traditional Chinese kung-fu robe (black with red trim and golden dragon knot)
  if (dy >= 10 && dy < 125 && Math.abs(dx) < 75) {
    // Red collar/lapel
    if (Math.abs(dx + dy * 0.3) < 8 || Math.abs(dx - dy * 0.3) < 8) return [220, 38, 38, 255];
    // Gold buttons
    if (Math.abs(dx) < 6 && (dy === 40 || dy === 65 || dy === 90)) return [250, 204, 21, 255];
    return [24, 24, 27, 255]; // Deep black silk
  }

  const bgR = 18;
  const bgG = 25;
  const bgB = 70;
  return [bgR, bgG, bgB, 255];
}

// 8. Character 03: Ramadan Mabrouk
function drawCharacter03(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > w * 0.48) return [0, 0, 0, 0];
  if (dist > w * 0.44) return [59, 130, 246, 255];

  // Head with round teacher glasses & serious comic scowl
  const headDist = Math.sqrt(dx * dx + (dy + 35) * (dy + 35));
  if (headDist < 60) {
    // Big round spectacles
    const leftGlass = Math.sqrt((dx + 18) * (dx + 18) + (dy + 38) * (dy + 38));
    const rightGlass = Math.sqrt((dx - 18) * (dx - 18) + (dy + 38) * (dy + 38));
    if ((leftGlass > 10 && leftGlass < 13) || (rightGlass > 10 && rightGlass < 13) || (Math.abs(dy + 38) < 2 && Math.abs(dx) < 18)) {
      return [15, 23, 42, 255];
    }
    // Mustache
    if (dy > -18 && dy < -10 && Math.abs(dx) < 18) return [30, 30, 30, 255];
    return [245, 185, 135, 255];
  }

  // Classic teacher brown suit
  if (dy >= 10 && dy < 125 && Math.abs(dx) < 75) {
    if (Math.abs(dx) < 8 && dy < 85) return [20, 83, 45, 255]; // Green tie
    if (Math.abs(dx) < 20 && dy < 30) return [255, 255, 255, 255]; // Shirt
    return [120, 53, 15, 255]; // Brown suit
  }

  return [15, 25, 60, 255];
}

// 9. Character 04: Nader El-Shoga'a (Askar fil Mo'askar)
function drawCharacter04(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > w * 0.48) return [0, 0, 0, 0];
  if (dist > w * 0.44) return [34, 197, 94, 255];

  // Head with black beret cap
  const headDist = Math.sqrt(dx * dx + (dy + 35) * (dy + 35));
  if (dy < -60 && Math.abs(dx) < 55) return [15, 23, 42, 255]; // Beret
  if (headDist < 60) {
    return [245, 185, 135, 255];
  }

  // Black police recruit uniform
  if (dy >= 10 && dy < 125 && Math.abs(dx) < 75) {
    // Red epaulet / chevron
    if (Math.abs(dx) > 40 && dy < 45) return [220, 38, 38, 255];
    return [24, 24, 27, 255];
  }

  return [15, 30, 55, 255];
}

// Run asset generator
const assets = [
  { file: "public/assets/logos/yly.png", w: 300, h: 300, fn: drawYLY },
  { file: "public/assets/logos/5in1.png", w: 300, h: 300, fn: draw5in1 },
  { file: "public/assets/logos/ministry.png", w: 300, h: 300, fn: drawMinistry },
  { file: "public/assets/hero/belo.png", w: 360, h: 360, fn: drawBelo },
  { file: "public/assets/hero/hero-character.png", w: 360, h: 360, fn: drawHeroCharacter },
  { file: "public/assets/characters/character-01.png", w: 360, h: 360, fn: drawCharacter01 },
  { file: "public/assets/characters/character-02.png", w: 360, h: 360, fn: drawCharacter02 },
  { file: "public/assets/characters/character-03.png", w: 360, h: 360, fn: drawCharacter03 },
  { file: "public/assets/characters/character-04.png", w: 360, h: 360, fn: drawCharacter04 },
];

for (const a of assets) {
  const dir = path.dirname(a.file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const buf = createRGBA_PNG(a.w, a.h, a.fn);
  fs.writeFileSync(a.file, buf);
  console.log(`Generated: ${a.file} (${buf.length} bytes)`);
}

console.log("All starter campaign assets successfully created!");
