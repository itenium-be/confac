import {vi, type MockedFunction} from 'vitest';
import {ApiClient} from '../api-client';
import {ApiConfig} from '../api-config';
import {BillitError} from '../billit-error';
import {testApiConfig} from './api-config.fixture';

vi.mock('../../../logger', () => ({logger: {info: vi.fn(), error: vi.fn()}}));

const mockFetch = vi.fn() as MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('ApiClient.deleteOrder', () => {
  let apiClient: ApiClient;
  const apiConfig: ApiConfig = testApiConfig;

  beforeEach(() => {
    apiClient = new ApiClient(apiConfig);
    vi.clearAllMocks();
  });

  it('DELETEs the order at Billit', async () => {
    mockFetch.mockResolvedValueOnce({ok: true, status: 200, headers: new Headers()} as Response);

    await apiClient.deleteOrder(128275964);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe(`${apiConfig.apiUrl}/orders/128275964`);
    expect(options?.method).toBe('DELETE');
    expect((options?.headers as Record<string, string>).ApiKey).toBe(apiConfig.apiKey);
  });

  it('throws a BillitError carrying the error codes when Billit refuses', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      headers: new Headers(),
      text: () => Promise.resolve(JSON.stringify({errors: [{Code: 'OrderAlreadySent'}]})),
    } as unknown as Response);

    await expect(apiClient.deleteOrder(128275964)).rejects.toThrow(BillitError);
  });

  it('reports which order could not be deleted', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers(),
      text: () => Promise.resolve('Not found'),
    } as unknown as Response);

    await expect(apiClient.deleteOrder(128275964)).rejects.toThrow('Failed to delete order at Billit');
  });
});
