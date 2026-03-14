// server/services/diffService.js
import { diffLines } from "diff";

export function generateDiff(original, modified, filePath) {
  const diff = diffLines(original, modified);
  let output = "";

  diff.forEach(part => {
    const prefix = part.added ? "+" : part.removed ? "-" : " ";
    output += prefix + part.value;
  });

  return output;
}