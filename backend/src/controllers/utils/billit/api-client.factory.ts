import {ApiClient, ApiConfig} from '../../../services/billit';
import {IConfig} from '../../../config';
import {fromConfig as createApiConfigFromConfig} from './api-config.factory';
import {MockApiClient} from '../../../services/billit/mock-api-client';

export function fromConfig(config: IConfig): ApiClient {
  // TODO: do return the actual API again...
  const apiConfig: ApiConfig = createApiConfigFromConfig(config);
  // return new ApiClient(apiConfig);
  return new MockApiClient();
}
