#!/usr/bin/env node
// Verifica que las pantallas y componentes visibles de la app no contengan
// textos orientados a la defensa académica del TFG (menciones a LLM,
// proveedores de IA externos, "no genera/no inventa", "tribunal", "TFG", etc.).
// La trazabilidad técnica puede vivir en la documentación y en los tipos,
// pero nunca debe aparecer como copy visible para el usuario final.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const FORBIDDEN_PATTERNS = [
  { label: "LLM", pattern: /\bLLM\b/ },
  { label: "ChatGPT", pattern: /ChatGPT/i },
  { label: "OpenAI", pattern: /OpenAI/i },
  { label: "tribunal", pattern: /\btribunal\b/i },
  { label: "TFG", pattern: /\bTFG\b/ },
  { label: "defensa académica", pattern: /\bdefensa\b/i },
  { label: '"no genera el itinerario"', pattern: /no genera el itinerario/i },
  { label: '"no inventa lugares"', pattern: /no inventa lugares/i },
];

const TARGET_DIRS = ["src/app/pantallas", "src/app/componentes"];
const EXTENSIONS = new Set([".ts", ".tsx"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
    } else {
      const ext = entry.slice(entry.lastIndexOf("."));
      if (EXTENSIONS.has(ext)) files.push(fullPath);
    }
  }
  return files;
}

let violations = 0;

for (const relativeDir of TARGET_DIRS) {
  const absoluteDir = join(ROOT, relativeDir);
  for (const file of walk(absoluteDir)) {
    const content = readFileSync(file, "utf8");
    for (const { label, pattern } of FORBIDDEN_PATTERNS) {
      const match = content.match(pattern);
      if (match) {
        violations += 1;
        const relativeFile = file.replace(`${ROOT}/`, "").replace(/\\/g, "/");
        console.error(`[check-forbidden-copy] ${relativeFile}: contiene "${match[0]}" (${label})`);
      }
    }
  }
}

if (violations > 0) {
  console.error(
    `\n[check-forbidden-copy] Se han encontrado ${violations} texto(s) no aptos para la interfaz de usuario.`
  );
  process.exit(1);
}

console.log("[check-forbidden-copy] OK: sin textos prohibidos en pantallas ni componentes.");
