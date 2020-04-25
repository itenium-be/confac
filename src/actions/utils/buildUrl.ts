const urlPrefix = require('../../config-front').backend;

export function buildUrl(url: string): string {
  return urlPrefix + url;
}
