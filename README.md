confac-back
===========
Starting DEV
------------

Expects running mongo with `src/config.json` settings.  
A vagrant box with this configuration can be found in [confac-vagrant][confac-vagrant].

```
# Start dev server
npm start

# Build project
npm run deploy
# Copy some config.json to deploy folder
npm run start:deploy

# Start forever
npm run prod
```

Template testing
----------------
Location: `./templates/*.pug`

```
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npm run serve
```

[confac-vagrant]: https://github.com/be-pongit/confac-vagrant
