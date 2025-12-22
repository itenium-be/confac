import {fromConfig} from '../api-client.factory';
import {ApiClient} from '../../services/billit';
import {IConfig} from '../../config';
import {testConfig} from './config.fixture';

describe('fromConfig', () => {
  const config: IConfig = {
    ...testConfig,
    services: {
      ...testConfig.services,
      billit: {
        ...testConfig.services.billit,
        apiUrl: 'https://mock.api.billit.be/v1',
        apiKey: 'mock-api-key',
        partyId: 'mock-party-id',
        contextPartyId: 'mock-context-party-id',
      },
    },
  };

  it('should create an ApiClient instance from config', () => {
    const client: ApiClient = fromConfig(config);
    expect(client).toBeInstanceOf(ApiClient);
  });

  it('should create a new instance on each call', () => {
    const client1: ApiClient = fromConfig(config);
    const client2: ApiClient = fromConfig(config);

    expect(client1).toBeInstanceOf(ApiClient);
    expect(client2).toBeInstanceOf(ApiClient);
    expect(client1).not.toBe(client2);
  });
});
