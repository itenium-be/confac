import path from 'path';
import fs from 'fs';
import pug from 'pug';

// Compiles every *.pug file under backend/templates/ with pug 3.
// Catches lexer/parser regressions that tsc + unit tests miss, since
// templates are otherwise only exercised at runtime when rendering an
// invoice PDF.

const templatesDir = path.resolve(__dirname, '../../templates');
const pugFiles = fs
  .readdirSync(templatesDir)
  .filter(f => f.endsWith('.pug'))
  .map(f => path.join(templatesDir, f));

describe('pug templates :: compile', () => {
  it('finds at least one template', () => {
    expect(pugFiles.length).toBeGreaterThan(0);
  });

  it.each(pugFiles)('compiles %s without throwing', file => {
    expect(() => pug.compileFile(file)).not.toThrow();
  });
});
