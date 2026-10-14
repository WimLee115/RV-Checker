// Hernoemt het gebundelde enkele-bestand-resultaat naar iets herkenbaars voor een
// niet-technische gebruiker, in plaats van het generieke "index.html". Als los Node-
// scriptje (i.p.v. een shell `mv`) zodat dit zonder verschil werkt op Windows/macOS/Linux.
import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'dist-standalone';
const van = join(outDir, 'index.html');
const naar = join(outDir, 'RV-Checker.html');

if (!existsSync(van)) {
  console.error(`Verwacht bestand niet gevonden: ${van}`);
  process.exit(1);
}

renameSync(van, naar);
console.log(`Standalone bestand klaar: ${naar}`);
