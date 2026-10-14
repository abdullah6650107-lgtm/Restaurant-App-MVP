const fs = require("fs");
const source = fs.readFileSync("A2/SRS_v2.md", "utf8");
const lines = [];
for (const raw of source.split(String.fromCharCode(10))) {
  const line = raw.replace(/^#+/, "").trim();
  if (!line) { lines.push(""); continue; }
  for (let i = 0; i < line.length; i += 88) lines.push(line.slice(i, i + 88));
}
const pages = [];
for (let i = 0; i < lines.length; i += 42) pages.push(lines.slice(i, i + 42));
const objs = ["<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [" + pages.map((_, i) => (3 + i * 2) + " 0 R").join(" ") + "] /Count " + pages.length + " >>"];
for (let i = 0; i < pages.length; i++) {
  const pageId = 3 + i * 2, contentId = pageId + 1;
  objs.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents " + contentId + " 0 R >>");
  const commands = ["BT", "/F1 10 Tf", "50 760 Td", "14 TL"];
  for (const line of pages[i]) {
    const safe = line.split(String.fromCharCode(92)).join(String.fromCharCode(92,92)).split("(").join(String.fromCharCode(92)+"(").split(")").join(String.fromCharCode(92)+")");
    commands.push("(" + safe + ") Tj", "T*");
  }
  commands.push("ET");
  const stream = commands.join(String.fromCharCode(10));
  objs.push("<< /Length " + Buffer.byteLength(stream, "ascii") + " >>\nstream\n" + stream + "\nendstream");
}
let pdf = "%PDF-1.4\n";
const offsets = [0];
for (let i = 0; i < objs.length; i++) { offsets.push(Buffer.byteLength(pdf, "ascii")); pdf += (i + 1) + " 0 obj\n" + objs[i] + "\nendobj\n"; }
const xref = Buffer.byteLength(pdf, "ascii");
pdf += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
for (const offset of offsets.slice(1)) pdf += String(offset).padStart(10, "0") + " 00000 n \n";
pdf += "trailer\n<< /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
fs.writeFileSync("A2/SRS_v2.pdf", pdf, "binary");
