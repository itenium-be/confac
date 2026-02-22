import {backend as urlPrefix} from '../../config-front';

export function buildUrl(url: string): string {
  return urlPrefix + url;
}
