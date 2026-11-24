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
// A second sentence could also hide behind an exclamation or question mark,
// so the one-sentence rule has to count every sentence terminator, and the
// file on disk must match the intended line byte for byte (no trailing
// newline sneaking in, no encoding surprise).
const terminators = [...LINE].filter((c) => c === "." || c === "!" || c === "?").length;
if (terminators !== 1) fail(`expected exactly one sentence terminator, found ${terminators}`);
if (written !== LINE) fail("the written file does not match the entry line exactly");
// Count characters only after Unicode normalisation: the same visible text
// can be encoded as one composed code point or as a base letter plus a
// combining mark, and a raw code-point count would score those differently.
// Require the canonical NFC form so the length above is the length a reader
// (and the gate) actually sees, and reject any non-NFC bytes on disk.
if (LINE !== LINE.normalize("NFC")) fail("the entry line is not in Unicode NFC form");
if (written !== written.normalize("NFC")) fail("the written file is not in Unicode NFC form");
// Whitespace hygiene: the trim check above only rejects an all-whitespace
// entry, so a stray leading/trailing space or a doubled internal space
// would still pass while changing the presented line. Reject those too —
// tabs are already excluded by the single-line rule in spirit, but check
// them explicitly alongside the spaces.
if (written !== written.trim()) fail("the entry has leading or trailing whitespace");
if (written.includes("  ")) fail("the entry contains a double space");
if (written.includes("\t")) fail("the entry contains a tab character");
console.log(`wrote ${target} (${chars} characters, gate 1-${MAX_CHARS}: ok)`);
