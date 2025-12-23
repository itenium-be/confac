import {IConfig} from '../../../../config';

export const testConfig: IConfig = {
  db: {
    host: '',
    db: '',
    port: -1,
    user: '',
    pwd: '',
  },
  server: {
    host: '',
    port: -1,
    basePath: '',
  },
  services: {
    excelCreator: '',
    billit: {
      apiUrl: '',
      apiKey: '',
      partyId: '',
      contextPartyId: '',
    },
  },
  email: {
    host: '',
    port: -1,
    secure: false,
    user: '',
    pass: '',
  },
  ENVIRONMENT: '',
  tag: 'unset',
  ENABLE_ROOT_TEMPLATES: -1,
  security: {
    clientId: '',
    secret: '',
    domain: '',
    defaultRole: '',
  },
  jwt: {
    secret: '',
    expiresIn: -1,
    superUser: '',
  },
  logging: {
    fileDir: '',
    lokiUrl: '',
  },
};
