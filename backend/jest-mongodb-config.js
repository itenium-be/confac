module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '3.5.8',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
    mongoURLEnvName: 'MONGO_URL',
  },
};
