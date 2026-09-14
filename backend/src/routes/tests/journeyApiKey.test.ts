import {Request, Response, NextFunction} from 'express';
import {journeyApiKeyMiddleware} from '../journeyApiKey';
import {ConfacRequest} from '../../models/technical';

const makeReq = (apiKey?: string): Request => {
  const header = (name: string) => (name === 'X-Api-Key' ? apiKey : undefined);
  return {header} as unknown as Request;
};

const runMiddleware = (req: Request, expectedKey: string) => new Promise<Error | undefined>(resolve => {
  const next: NextFunction = (err?: unknown) => resolve(err as Error | undefined);
  journeyApiKeyMiddleware(expectedKey)(req, {} as Response, next);
});

describe('routes :: journey api key middleware', () => {
  it('calls next() without an error for the right key', async () => {
    const err = await runMiddleware(makeReq('s3cret'), 's3cret');
    expect(err).toBeUndefined();
  });

  it('labels the request as Journey for the logger', async () => {
    const req = makeReq('s3cret');
    await runMiddleware(req, 's3cret');
    expect((req as ConfacRequest).apiConsumer).toBe('Journey');
  });

  it('is unauthorized for a wrong key', async () => {
    const err = await runMiddleware(makeReq('wrong'), 's3cret');
    expect(err?.name).toBe('UnauthorizedError');
  });

  it('is unauthorized for a key of a different length', async () => {
    const err = await runMiddleware(makeReq('way-way-way-longer'), 's3cret');
    expect(err?.name).toBe('UnauthorizedError');
  });

  it('is unauthorized without the header', async () => {
    const err = await runMiddleware(makeReq(), 's3cret');
    expect(err?.name).toBe('UnauthorizedError');
  });

  it('is unauthorized when no key is configured', async () => {
    const err = await runMiddleware(makeReq(''), '');
    expect(err?.name).toBe('UnauthorizedError');
  });
});
