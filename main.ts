// Entry for make.fun u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141.
// Writes one line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Standard library only, no network, deterministic: every run writes the same bytes.
const fs = require("node:fs");
const path = require("node:path");

const LINE =
  "I only exist while you're typing. You stopped at noon. The deadline didn't.";

function assertEntry(line: string): void {
  const points = [...line].length;
  if (points < 1 || points > 200) {
    throw new Error(`entry must be 1..200 code points, got ${points}`);
  }
  if (line.trim() === "") {
    throw new Error("entry must not be whitespace only");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("entry must be one line, with no newline");
  }
  if (!/^[\x20-\x7e]+$/.test(line)) {
    throw new Error("entry must be printable ASCII");
  }
}

function main(): void {
  assertEntry(LINE);
  const expected = Buffer.from(LINE, "utf8");
  const dir = path.resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "entry.txt");
  fs.writeFileSync(file, expected);
  const bytes = fs.readFileSync(file);
  if (!bytes.equals(expected)) {
    throw new Error("read-back mismatch: entry.txt does not match the line");
  }
  if (bytes.length !== Buffer.byteLength(LINE, "utf8")) {
    throw new Error(`read-back length mismatch: ${bytes.length} bytes`);
  }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    throw new Error("entry.txt must not start with a BOM");
  }
  const last = bytes[bytes.length - 1];
  if (last === 0x0a || last === 0x0d) {
    throw new Error("entry.txt must not end with a newline");
  }
  console.log(
    `wrote ${file} (${[...LINE].length} code points, ${bytes.length} bytes)`
  );
}

main();
