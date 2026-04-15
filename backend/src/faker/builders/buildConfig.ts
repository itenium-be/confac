// backend/src/faker/builders/buildConfig.ts
import {ITENIUM_TEST_CONFIG} from '../data/config';

/** The config is already fully shaped in data/config.ts; this is a seam for future transforms. */
export function buildConfig() {
  return {...ITENIUM_TEST_CONFIG};
}
