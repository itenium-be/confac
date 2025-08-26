import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import os from 'os';
import fetch from 'node-fetch';
import appConfig from './config';

const fileTransport = new DailyRotateFile({
  level: 'info',
  dirname: appConfig.logging.fileDir,
  filename: 'confac-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '90d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});


export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {},
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



if (appConfig.logging.lokiUrl) {
  const sendToLoki = async (logEntry: any) => {
    try {
      const payload = {
        streams: [{
          stream: {
            // Labels:
            app: 'confac',
            level: logEntry.level,
            service_name: 'confac-backend',
            env: appConfig.ENVIRONMENT,
            MachineName: os.hostname(),
          },
          values: [[`${Date.now().toString()}000000`, JSON.stringify(logEntry)]],
        }],
      };

      await fetch(`${appConfig.logging.lokiUrl}/loki/api/v1/push`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
    } catch (error: any) {} // eslint-disable-line no-empty
  };

  logger.on('data', sendToLoki);
}




console.log = (...args) => { // eslint-disable-line no-console
  logger.info(args.join(' '));
};

console.error = (...args) => { // eslint-disable-line no-console
  if (args[0]?.includes('[MONGODB DRIVER] DeprecationWarning')) {
    logger.warn(args.join(' '));
  } else {
    logger.error(args.join(' '));
  }
};

console.warn = (...args) => { // eslint-disable-line no-console
  logger.warn(args.join(' '));
};
