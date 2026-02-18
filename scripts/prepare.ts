import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const CHUNK_SIZE = 1000;
const DATA_DIR = join(import.meta.dirname, "..", "data");
const OUT_DIR = join(import.meta.dirname, "..", "public", "data");

const TYPES = ["noun", "verb", "adj", "adv"] as const;

const shuffle = <T>(xs: readonly T[]): T[] => {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

const chunk = <T>(xs: readonly T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += size) {
    out.push(xs.slice(i, i + size));
  }
  return out;
};

const toSmartTypography = (line: string): string => {
  const ellipsisAndDashes = line
    .replace(/\.{3}/g, "…")
    .replace(/---/g, "—")
    .replace(/--/g, "–");

  const chars = [...ellipsisAndDashes];
  const out: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    const prev = i > 0 ? chars[i - 1]! : "";
    const next = i < chars.length - 1 ? chars[i + 1]! : "";

    if (ch === "\"") {
      const opens = i === 0 || /[\s([{\-–—]/.test(prev);
      out.push(opens ? "“" : "”");
      continue;
    }

    if (ch === "'") {
      const isApostrophe =
        /[A-Za-z0-9]/.test(prev) &&
        (/[A-Za-z0-9]/.test(next) || next === "s" || next === "S");
      const opens = i === 0 || /[\s([{\-–—]/.test(prev);
      out.push(isApostrophe ? "’" : opens ? "‘" : "’");
      continue;
    }

    out.push(ch);
  }

  return out.join("");
};

const readLines = (path: string): string[] =>
  readFileSync(path, "utf-8")
    .split("\n")
    .filter((line) => line.trim().length > 0);

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const manifest: Record<string, { chunks: number; lines: number }> = {};

for (const type of TYPES) {
  const lines = readLines(join(DATA_DIR, `${type}.txt`)).map(toSmartTypography);
  const shuffled = shuffle(lines);
  const chunks = chunk(shuffled, CHUNK_SIZE);

  const typeDir = join(OUT_DIR, type);
  mkdirSync(typeDir, { recursive: true });

  for (let i = 0; i < chunks.length; i++) {
    writeFileSync(join(typeDir, `${i}.txt`), chunks[i]!.join("\n"));
  }

  manifest[type] = { chunks: chunks.length, lines: lines.length };

  console.log(
    `${type}: ${lines.length} lines → ${chunks.length} chunks of ≤${CHUNK_SIZE}`,
  );
}

writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest));
console.log("wrote manifest.json");
