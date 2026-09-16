import {spawnSync} from 'child_process';
import path from 'path';

const fakerScript = path.resolve(__dirname, '../index.ts');

/** The Coolify stack gates the app on `faker` completing successfully (docker-compose.yml) */
describe('faker :: exit code', () => {
  it('exits non-zero when the database is unreachable', () => {
    const {status} = spawnSync('bun', [fakerScript], {
      encoding: 'utf8',
      env: {
        ...process.env,
        MONGO_HOST: '127.0.0.1',
        MONGO_PORT: '1',
        MONGO_DB: 'confac',
        MONGO_USERNAME: '',
        MONGO_PASSWORD: '',
      },
    });

    expect(status).not.toBe(0);
  }, 30000);
});
