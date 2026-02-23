// Exercises 0: Basic
// Vitest Mocks for google-auth-library

import {vi} from 'vitest';
import type {OAuth2Client as _OAuth2Client} from 'google-auth-library';
import {verify} from '../user';

interface MockPayload {
  email_verified?: boolean;
  email?: string;
  aud?: string;
  hd?: string;
}

let payload: MockPayload | null = null;

vi.mock('../../config', () => ({
  default: {
    security: {
      clientId: 'string',
      secret: 'string',
      domain: 'string',
      defaultRole: 'string',
    },
  },
}));

vi.mock('google-auth-library', async () => {
  class FakeOAuth2Client {
    verifyIdToken() {
      return {getPayload: () => payload};
    }
  }

  const originalModule = await vi.importActual('google-auth-library');
  return {
    __esModule: true,
    ...originalModule,
    OAuth2Client: FakeOAuth2Client,
  };
});


// Alternative way:
// const mockedAuthClient = jest.mocked(OAuth2Client);
// const getPayloadMock = jest.fn();
// const authClientMock = jest
//   .spyOn(OAuth2Client.prototype, 'verifyIdToken')
//   .mockImplementation(() => ({ getPayload: getPayloadMock }))


describe('user controller :: verify', () => {
  beforeEach(() => {
    // mockedAuthClient.mockClear();
    // authClientMock.mockClear();
  });

  it('returns "Invalid token" if it fails to get the payload', async () => {
    const result = await verify('token');
    expect(result).toBe('Invalid token');
  });

  it('checks the audience & domain corresponds to ../config', async () => {
    payload = {
      email_verified: true,
      email: 'email',
      aud: 'string', // matches mocked config.security.clientId
      hd: 'string', // matches mocked config.security.domain
    };
    const result = await verify('token');

    expect(result).toBeInstanceOf(Object);
  });

  it.skip('sets a default role if one has been set in config', () => {

  });

  it.skip('automatically activates a user when a default role has been set in config', () => {

  });

  it.skip('sets the audit property', () => {

  });
});
