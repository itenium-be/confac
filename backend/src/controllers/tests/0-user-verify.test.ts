import { verify } from '../user'
import { OAuth2Client } from 'google-auth-library';

// jest.mock('google-auth-library', () => {
//   const originalModule = jest.requireActual('google-auth-library');
//   return {
//     __esModule: true,
//     ...originalModule,
//     // OAuth2Client:
//   };
// });

jest.mock('google-auth-library');

const mockedAuthClient = jest.mocked(OAuth2Client);

const getPayloadMock = jest.fn();
const authClientMock = jest
  .spyOn(OAuth2Client.prototype, 'verifyIdToken')
  .mockImplementation(() => ({ getPayload: getPayloadMock }));

describe('user controller :: verify', () => {
  beforeEach(() => {
    mockedAuthClient.mockClear();
    authClientMock.mockClear();
    getPayloadMock.mockClear();
  })

  it('uses the google-auth-library :: OAuth2Client', async () => {
    await verify('token');
    expect(OAuth2Client).toHaveBeenCalled();
  })

  it('returns "Invalid token" if it fails to get the payload', async () => {
    const result = await verify('token');
    expect(result).toBe('Invalid token')
  })

  it('checks the audiance corresponds to ../config', async () => {
    getPayloadMock.mockResolvedValue({email_verified: true, email: 'email'})
    const result = await verify('token');
    expect(result).toBeInstanceOf(Object)
  })

  // it('', () => {

  // })
})
