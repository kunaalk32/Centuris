// Renders src/pages/*.html into dist/, filling {{key}} from site.config.json
// and {{> partial}} from src/partials/. Tailwind runs separately (see package.json).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync } from "node:fs";

const config = JSON.parse(readFileSync("site.config.json", "utf8"));
const partials = Object.fromEntries(
  readdirSync("src/partials").map((f) => [f.replace(/\.html$/, ""), readFileSync(`src/partials/${f}`, "utf8")])
);

const lookup = (path) => path.split(".").reduce((obj, key) => obj?.[key], config);

function render(html) {
  return html
    .replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
      if (!(name in partials)) throw new Error(`Unknown partial: ${name}`);
      return partials[name];
    })
    .replace(/\{\{\s*json\s*\}\}/g, () => JSON.stringify({ activecampaign: config.activecampaign }))
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
      const value = lookup(path);
      if (value === undefined) throw new Error(`Unknown config key: ${path}`);
      return value;
    });
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/assets", { recursive: true });
for (const file of readdirSync("src/pages")) {
  // Partials may contain {{key}} tokens, so render twice.
  writeFileSync(`dist/${file}`, render(render(readFileSync(`src/pages/${file}`, "utf8"))));
}
cpSync("src/assets", "dist/assets", { recursive: true });
cpSync("brand/logos", "dist/assets/logos", { recursive: true, filter: (src) => !src.endsWith(".md") });
mkdirSync("dist/assets/vendor");
for (const lib of ["gsap/dist/gsap", "gsap/dist/ScrollTrigger", "lenis/dist/lenis"]) {
  cpSync(`node_modules/${lib}.min.js`, `dist/assets/vendor/${lib.split("/").pop()}.min.js`);
}
writeFileSync("dist/.nojekyll", "");
console.log(`Built ${readdirSync("src/pages").length} pages`);
