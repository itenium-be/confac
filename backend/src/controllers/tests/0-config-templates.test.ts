// Exercises 0: Basic
// Mocking the FileSystem
// SRP: Saving config to a db and pug templating are 2 very different things

// NOTE: These imports are commented out because importing ../config triggers
// the mongodb driver which causes require-at errors on Windows.
// import {vi} from 'vitest';
// import {Response} from 'express';
// import fs from 'fs';
// import {getTemplates} from '../config';

// vi.mock('fs');
// const mockedFs = vi.mocked(fs);
// const req = {} as any;
// const res = {send: (x: string[]) => Promise.resolve(x)} as unknown as Response;


describe('config controller :: getTemplates', () => {
  // This test breaks CI even when skipping, so it is commented out for now

  // TODO: hmm, the rest is green but there is a weird error in the console
  // TODO: What to do...
  // --> Fix the required-at error (Hint: you probably don't want to go down this road;)
  // --> Move getTemplates to a separate file (VSCode Extension: glean?)
  /* it('returns all pug files in relative folder ./templates when !ENABLE_ROOT_TEMPLATES', async () => {
    mockedFs.readdirSync.mockReturnValue(['test.pug'] as any);
    const result = await getTemplates(req, res);

    expect(result).toHaveLength(0);

    // ['test.pug'] as any???
    // Could use:
    // type readdirSyncOp = (path: PathLike) => string[]
    // (mockedFs.readdirSync as readdirSyncOp) = jest.fn(() => ['test.pug'])
    // (not sure if that is "cleaner" in this case)
  }) */

  it.skip('returns all pug files in root folder /templates when ENABLE_ROOT_TEMPLATES', async () => {

  });

  it.skip('doesnt return other file types', async () => {

  });

  it.skip('strips off the .pug extension', async () => {

  });
});
