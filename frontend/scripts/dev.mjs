import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const server = await createServer({
  root,
  configFile: resolve(root, 'vite.config.ts'),
});

await server.listen();
server.printUrls();
