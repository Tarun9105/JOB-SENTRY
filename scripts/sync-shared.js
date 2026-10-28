import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SOURCE_SHARED_DIR = path.join(ROOT_DIR, 'shared');
const TARGET_SERVICES = [
  { name: 'backend', targetDir: path.join(ROOT_DIR, 'backend', 'shared') },
  { name: 'frontend', targetDir: path.join(ROOT_DIR, 'frontend', 'shared') },
  { name: 'ml_service', targetDir: path.join(ROOT_DIR, 'ml_service', 'shared') },
];

function syncSharedContracts() {
  console.log('[sync:shared] Starting contract synchronization from root /shared (SSOT)...');

  if (!fs.existsSync(SOURCE_SHARED_DIR)) {
    console.error(`[sync:shared] ERROR: Source directory ${SOURCE_SHARED_DIR} does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_SHARED_DIR);
  if (files.length === 0) {
    console.warn('[sync:shared] Warning: No files found in root /shared directory.');
    return;
  }

  for (const service of TARGET_SERVICES) {
    if (!fs.existsSync(service.targetDir)) {
      fs.mkdirSync(service.targetDir, { recursive: true });
    }

    for (const file of files) {
      const srcPath = path.join(SOURCE_SHARED_DIR, file);
      const destPath = path.join(service.targetDir, file);

      // Determine appropriate files for service
      // e.g. ml_service primarily uses models.py & schema.json, but copying all ensures universal availability
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Synced ${file} -> ${service.name}/shared/${file}`);
    }
  }

  // Ensure public directory has RESEARCH_PAPER.md for CDN and static serving
  const publicDir = path.join(ROOT_DIR, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const rootPaperPath = path.join(ROOT_DIR, 'RESEARCH_PAPER.md');
  const publicPaperPath = path.join(publicDir, 'RESEARCH_PAPER.md');
  if (fs.existsSync(rootPaperPath)) {
    fs.copyFileSync(rootPaperPath, publicPaperPath);
    console.log('  ✓ Synced RESEARCH_PAPER.md -> public/RESEARCH_PAPER.md');
  }

  console.log('[sync:shared] All shared contracts successfully synchronized across all services.');
}

syncSharedContracts();
