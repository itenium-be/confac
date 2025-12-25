import {ApiClient, ApiConfig} from '../../../services/billit';
import {IConfig} from '../../../config';
import {fromConfig as createApiConfigFromConfig} from './api-config.factory';

export function fromConfig(config: IConfig): ApiClient {
  const apiConfig: ApiConfig = createApiConfigFromConfig(config);
  return new ApiClient(apiConfig);
}
