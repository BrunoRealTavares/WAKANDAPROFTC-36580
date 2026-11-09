const fs = require("fs"), path = require("path");
const MARK = "export const instant = false";
function walk(p, acc = []) {
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    const f = path.join(p, e.name);
    if (e.isDirectory()) walk(f, acc); else if (e.name === "page.tsx") acc.push(f);
  }
  return acc;
}
const pages = walk("src/app/painel");
let n = 0;
for (const f of pages) {
  let t = fs.readFileSync(f, "utf8");
  if (t.includes(MARK)) continue;
  const banner =
    MARK +
    ";\n// Rota bloqueante por design: le a sessao/cookies em todo request (Cache Components).\n\n";
  fs.writeFileSync(f, banner + t);
  n++;
  console.log("OK " + f);
}
console.log("TOTAL " + n);
