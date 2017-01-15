import {createApp} from './server-init.js';

const config = require('../config.json');

const app = createApp();
app.listen(config.server.port);
