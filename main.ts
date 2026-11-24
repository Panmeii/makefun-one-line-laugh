// The One-Line Laugh — a make.fun entry written for u-ronigrv-the-one-line-laugh-7ccca46f.
// Running this program writes the entry line to entry.txt inside the output
// directory (MAKEFUN_OUTPUT_DIR when set, otherwise /output), then checks the
// written text against the competition gate before reporting success.

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE = "I bought a planner to finally get my life together, and it worked — now all my failures are beautifully organised by date.";
const MAX_CHARS = 200;

function fail(reason) {
  console.error(`entry gate failed: ${reason}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.txt');
writeFileSync(target, LINE, 'utf8');

// Original verification stage: re-read what was actually written and hold it
// to the gate exactly as the competition states it.
const written = readFileSync(target, 'utf8');
const chars = [...written].length;
if (chars < 1 || chars > MAX_CHARS) fail(`length ${chars} is outside 1-${MAX_CHARS} characters`);
if (written.trim().length === 0) fail("the entry is only white space");
// One sentence means: no line break, and the only full stop is the final one.
if (LINE.includes("\n") || LINE.includes("\r")) fail("the line must stay on a single line");
const stops = [...LINE].filter((c) => c === ".").length;
if (stops !== 1 || !LINE.endsWith(".")) fail("expected exactly one sentence ending in a full stop");
console.log(`wrote ${target} (${chars} characters, gate 1-${MAX_CHARS}: ok)`);
