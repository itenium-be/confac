import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  console.log('Starting with NODE_ENV=development'); // eslint-disable-line no-console
  dotenv.config();
}

const appConfig: IConfig = {
  db: {
    host: process.env.MONGO_HOST || 'localhost',
    db: process.env.MONGO_DB || 'confac',
    port: +(process.env.MONGO_PORT || 27017),
    user: process.env.MONGO_USERNAME || '',
    pwd: process.env.MONGO_PASSWORD || '',
  },
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: +(process.env.PORT || 9000),
    basePath: process.env.SERVER_BASE_PATH || '',
  },
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  ENVIRONMENT: process.env.ENVIRONMENT || 'unset',
  tag: process.env.BUILD_VERSION || 'unset',
  ENABLE_ROOT_TEMPLATES: +(process.env.ENABLE_ROOT_TEMPLATES || 0),
  security: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    secret: process.env.GOOGLE_SECRET || '',
    domain: process.env.GOOGLE_DOMAIN,
    defaultRole: process.env.DEFAULT_ROLE,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'SUPER DUPER SECRET',
    expiresIn: +(process.env.JWT_EXPIRES || 0) || (5 * 60 * 60), // 5 hours
    superUser: process.env.SUPERUSER || '',
  },
};

export default appConfig;


export interface IConfig {
  db: {
    host: string;
    db: string;
    port: number;
    user: string | null;
    pwd: string | null;
  };
  server: {
    host: string;
    port: number;
    basePath: string;
  };
  SENDGRID_API_KEY: string;
  ENVIRONMENT: 'development' | string;
  /** Version in format YYYY-MM-DD */
  tag: string;
  ENABLE_ROOT_TEMPLATES: number;
  /** GSuite authentication */
  security: {
    clientId: string;
    secret: string;
    domain: string | undefined;
    /** If a defaultRole is defined, new users are automatically activated upon first login */
    defaultRole: string | undefined;
  };
  /** Confac security */
  jwt: {
    secret: string;
    /** In seconds */
    expiresIn: number;
    /** This email can login without an user.active record */
    superUser: string;
  };
}
