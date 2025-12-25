import {IConfig} from '../../../config';
import {ApiConfig} from '../../../services/billit';

export function fromConfig(config: IConfig): ApiConfig {
  const {apiUrl, apiKey, partyId, contextPartyId} = config.services.billit;
  return {
    apiUrl,
    apiKey,
    partyId,
    contextPartyId,
  };
}
