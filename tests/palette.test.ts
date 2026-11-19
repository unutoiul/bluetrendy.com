import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { palette, withAlpha } from "@/theme/palette";

const colour = /(?<![\w&#])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])|rgba?\(/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) return sourceFiles(file);
    return /\.(ts|tsx|css)$/.test(name) ? [file.split(path.sep).join("/")] : [];
  });
}

test("every colour comes from theme/palette.ts", () => {
  const offenders = ["app", "components", "theme", "lib", "data", "emails"].flatMap(sourceFiles)
    .filter(file => file !== "theme/palette.ts")
    .flatMap(file => readFileSync(file, "utf8").split("\n")
      .map((line, index) => (colour.test(line) ? `${file}:${index + 1}  ${line.trim().slice(0, 90)}` : null))
      .filter((line): line is string => line !== null));
  assert.deepEqual(offenders, [], "Use a palette token (palette.blue[425], withAlpha(...)) instead of a raw colour.");
});

test("palette values are six-digit hex and withAlpha keeps the colour", () => {
  const values = Object.values(palette).flatMap(entry => (typeof entry === "string" ? [entry] : Object.values(entry)));
  assert.ok(values.every(value => /^#[0-9a-f]{6}$/.test(value)));
  assert.equal(new Set(values).size, values.length, "each colour appears once");
  assert.equal(withAlpha(palette.navy[800], 0.5), "rgba(9, 27, 45, 0.5)");
});
