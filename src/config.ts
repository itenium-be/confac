const appConfig: IConfig = {
  db: {
    host: process.env.MONGO_HOST || 'localhost',
    db: process.env.MONGO_DB || 'confac-dev',
    otherDbs: 'confac-dev | confac-test | confac-acc | confac | confac-mi',
    port: +(process.env.MONGO_PORT || 32772),
    // itenium mongo port: 27016
    user: process.env.MONGO_USERNAME || 'admin',
    pwd: process.env.MONGO_PASSWORD || 'pwd',
  },
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: +(process.env.PORT || 9000),
    basePath: process.env.SERVER_BASE_PATH || '',
  },
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  ENABLE_ROOT_TEMPLATES: process.env.ENABLE_ROOT_TEMPLATES || false,
  security: {
    clientId: process.env.GOOGLE_CLIENT_ID || '783388290-8h2es2e18r938o7psm3ph1husigdcn19.apps.googleusercontent.com',
    secret: process.env.GOOGLE_SECRET || '',
    domain: process.env.GOOGLE_DOMAIN,
    defaultRole: process.env.DEFAULT_ROLE,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'SUPER DUPER SECRET',
    expiresIn: +(process.env.JWT_EXPIRES || 0) || (5 * 60 * 60), // 5 hours
    superUser: process.env.SUPERUSER || 'wouter.van.schandevijl@itenium.be',
  },
};

export default appConfig;


interface IConfig {
  db: {
    host: string;
    db: string;
    /* Not used: just for development copy/paste */
    otherDbs: string;
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
  ENABLE_ROOT_TEMPLATES: string | boolean;
  /** GSuite authentication */
  security: {
    clientId: string;
    secret: string;
    domain: string | undefined;
    /** If a defaultRole is defined, new users are automatically activated upon login */
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
