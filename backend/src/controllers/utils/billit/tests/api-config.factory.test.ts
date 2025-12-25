import {fromConfig} from '../api-config.factory';
import {IConfig} from '../../../../config';
import {testConfig} from './config.fixture';
import {ApiConfig} from '../../../../services/billit';

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

  it('should create an ApiConfig from config', () => {
    const apiConfig: ApiConfig = fromConfig(config);

    expect(apiConfig).toEqual({
      apiUrl: 'https://mock.api.billit.be/v1',
      apiKey: 'mock-api-key',
      partyId: 'mock-party-id',
      contextPartyId: 'mock-context-party-id',
    });
  });

  it('should return a plain object, not an instance', () => {
    const apiConfig: ApiConfig = fromConfig(config);

    expect(typeof apiConfig).toBe('object');
    expect(apiConfig.constructor).toBe(Object);
  });
});
