import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {jwtMiddleware, UnauthorizedError} from '../jwt';
import config from '../../config';

const fakePayload = {
data: {
_id: 'u1', email: 'a@b.c', firstName: 'A', name: 'B', alias: 'ab', active: true as const
}
};

const makeReq = (opts: {authHeader?: string; queryToken?: string; originalUrl?: string} = {}): Request => (
  {
    headers: opts.authHeader ? {authorization: opts.authHeader} : {},
    query: opts.queryToken ? {token: opts.queryToken} : {},
    originalUrl: opts.originalUrl || '/api/clients',
  } as unknown as Request
);

const runMiddleware = (req: Request, unlessPaths: string[] = []) => new Promise<Error | undefined>(resolve => {
    const next: NextFunction = (err?: unknown) => resolve(err as Error | undefined);
    jwtMiddleware(unlessPaths)(req, {} as Response, next);
  });

describe('routes :: jwt middleware', () => {
  const secret = config.jwt.secret;

  it('calls next() with a valid HS256 bearer token and sets req.user', async () => {
    const token = jwt.sign(fakePayload, secret, {expiresIn: 60, algorithm: 'HS256'});
    const req = makeReq({authHeader: `Bearer ${token}`});
    const err = await runMiddleware(req);
    expect(err).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((req as any).user.data.email).toBe('a@b.c');
  });

  it('accepts the token from ?token= query param', async () => {
    const token = jwt.sign(fakePayload, secret, {expiresIn: 60, algorithm: 'HS256'});
    const err = await runMiddleware(makeReq({queryToken: token}));
    expect(err).toBeUndefined();
  });

  it('fails with credentials_required when no token is sent', async () => {
    const err = await runMiddleware(makeReq());
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect((err as UnauthorizedError).code).toBe('credentials_required');
    expect((err as UnauthorizedError).name).toBe('UnauthorizedError');
  });

  it('fails with credentials_required on a non-Bearer Authorization header', async () => {
    const err = await runMiddleware(makeReq({authHeader: 'Basic user:pass'}));
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect((err as UnauthorizedError).code).toBe('credentials_required');
  });

  it('fails with invalid_token when signed with the wrong secret', async () => {
    const token = jwt.sign(fakePayload, 'wrong-secret', {expiresIn: 60, algorithm: 'HS256'});
    const err = await runMiddleware(makeReq({authHeader: `Bearer ${token}`}));
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect((err as UnauthorizedError).code).toBe('invalid_token');
  });

  it('fails with invalid_token when the token is expired', async () => {
    const token = jwt.sign(fakePayload, secret, {expiresIn: -1, algorithm: 'HS256'});
    const err = await runMiddleware(makeReq({authHeader: `Bearer ${token}`}));
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect((err as UnauthorizedError).code).toBe('invalid_token');
  });

  it('fails with invalid_token when the token was signed with a non-HS256 algorithm', async () => {
    // Defence against algorithm-confusion: reject tokens that weren't HS256.
    // We cannot actually sign an RS256 token without a keypair, so simulate
    // by crafting a token with an 'none' alg header and empty signature.
    const header = Buffer.from(JSON.stringify({alg: 'none', typ: 'JWT'})).toString('base64url');
    const body = Buffer.from(JSON.stringify(fakePayload)).toString('base64url');
    const token = `${header}.${body}.`;
    const err = await runMiddleware(makeReq({authHeader: `Bearer ${token}`}));
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect((err as UnauthorizedError).code).toBe('invalid_token');
  });

  it('bypasses paths in the unless list', async () => {
    const err = await runMiddleware(makeReq({originalUrl: '/api/user/login'}), ['/api/user/login']);
    expect(err).toBeUndefined();
  });

  it('does not bypass paths that are not in the unless list', async () => {
    const err = await runMiddleware(makeReq({originalUrl: '/api/clients'}), ['/api/user/login']);
    expect(err).toBeInstanceOf(UnauthorizedError);
  });
});
