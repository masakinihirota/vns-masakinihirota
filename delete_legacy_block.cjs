const fs = require("fs");
const path =
  "u:/2026src/vns-masakinihirota.worktrees/anti/src/components/user-profiles/prototypes/simple-gui/index.tsx";
const content = fs.readFileSync(path, "utf8");
const lines = content.split(/\r?\n/);

// Target Range: 1822 to 2288 (1-based)
// Index: 1821 to 2287
const startLine = 1822;
const endLine = 2288;
const startIndex = startLine - 1;
const endIndex = endLine - 1;
const count = endIndex - startIndex + 1;

console.log(`Total lines: ${lines.length}`);
console.log(`Deleting from line ${startLine} to ${endLine}`);
console.log(`First line to delete: ${lines[startIndex]}`);
console.log(`Last line to delete: ${lines[endIndex]}`);

if (
  lines[startIndex].trim().startsWith("/* const renderStep5_OLD") &&
  lines[endIndex].trim().startsWith("}; */")
) {
  lines.splice(startIndex, count);
  fs.writeFileSync(path, lines.join("\n"));
  console.log("Successfully deleted block.");
} else {
  console.error("Safety check failed. Lines do not match expected content.");
  console.error(`Expected start to contain: /* const renderStep5_OLD`);
  console.error(`Actual start: ${lines[startIndex]}`);
  console.error(`Expected end to contain: }; */`);
  console.error(`Actual end: ${lines[endIndex]}`);
  process.exit(1);
}
