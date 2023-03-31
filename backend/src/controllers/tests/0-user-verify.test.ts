// Exercises 0: Basic
// Jest Mocks for google-auth-library

import { verify } from '../user'
import { OAuth2Client } from 'google-auth-library';

let payload: any = null;

jest.mock('google-auth-library', () => {
  class FakeOAuth2Client {
    verifyIdToken() {
      return {getPayload: () => payload};
    }
  }

  const originalModule = jest.requireActual('google-auth-library');
  return {
    __esModule: true,
    ...originalModule,
    OAuth2Client: FakeOAuth2Client
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
  })

  it('returns "Invalid token" if it fails to get the payload', async () => {
    const result = await verify('token');
    expect(result).toBe('Invalid token')
  })

  it('checks the audiance & domain corresponds to ../config', async () => {
    payload = {email_verified: true, email: 'email', aud: '', hd: 'itenium.be'}
    const result = await verify('token');

    // TODO: It seems that the test is always green
    // TODO: it doesn't really take config into account?
    expect(result).toBeInstanceOf(Object)
  })

  it.skip('sets a default role if one has been set in config', () => {

  })

  it.skip('automatically activates a user when a default role has been set in config', () => {

  })

  it.skip('sets the audit property', () => {

  })
})
