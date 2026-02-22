import { build } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('Building with bundle analysis...');
try {
  await build({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    build: {
      rollupOptions: {
        plugins: [
          visualizer({
            filename: path.join(root, 'stats.html'),
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ],
      },
    },
  });

  console.log('\nOpening stats.html...');
  // Open the file in browser
  const statsPath = path.join(root, 'stats.html');
  if (process.platform === 'win32') {
    execSync(`start "" "${statsPath}"`, { shell: true });
  } else if (process.platform === 'darwin') {
    execSync(`open "${statsPath}"`);
  } else {
    execSync(`xdg-open "${statsPath}"`);
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
