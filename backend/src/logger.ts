import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import os from 'os';
import appConfig from './config';

const fileTransport = new DailyRotateFile({
  level: 'info',
  dirname: appConfig.logging.fileDir,
  filename: 'confac-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '90d',
});


export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: {
    service_name: 'confac-backend',
    app: 'confac',
    env: appConfig.ENVIRONMENT,
    MachineName: os.hostname(),
  },
  transports: [
    fileTransport,
  ],
});


if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({format: winston.format.simple()}));
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({level, message}) => {
        if (typeof message === 'string') {
          return `${level}: ${message}`;
        }
        return `${level}: ${JSON.stringify(message, null, 2)}`;
      }),
    ),
  }));
}


console.log = (...args) => { // eslint-disable-line no-console
  logger.info(args.join(' '));
};

console.error = (...args) => { // eslint-disable-line no-console
  logger.error(args.join(' '));
};

console.warn = (...args) => { // eslint-disable-line no-console
  logger.warn(args.join(' '));
};
