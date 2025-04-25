// scripts/copy-portal.js
const fs = require('fs');
const path = require('path');
const fsp = fs.promises;

const src = path.resolve(__dirname, '..', '..', 'fastboarding-portal', 'dist');
const dest = path.resolve(__dirname, '..', 'static', 'portal-build');

async function copyRecursive(srcDir, destDir) {
  await fsp.mkdir(destDir, { recursive: true });
  const entries = await fsp.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    // Limpia el destino si ya existe
    if (fs.existsSync(dest)) {
      await fsp.rm(dest, { recursive: true, force: true });
    }

    await copyRecursive(src, dest);
    console.log(`✅ Portal build copiado a static/portal-build`);
  } catch (err) {
    console.error('❌ Error copiando el portal:', err);
    process.exit(1);
  }
})();