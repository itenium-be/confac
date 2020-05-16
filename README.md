confac-back
===========

Starting DEV
------------

Expects running mongo with `src/config/index.ts` settings.  
A vagrant box with this configuration can be found in [confac-vagrant][confac-vagrant].

```bash
# Start dev server
npm start

# Build project
npm run deploy
# Copy some config.json to deploy folder
npm run start:deploy
```

Database
--------

In case you want to use MongoDB as a Docker container:

`docker run -d -p 32772:27017 --name confac-mongo mongo`


Emailing
--------

Development: Set `SENDGRID_API_KEY` in `src/config/index.ts`  
Production: Set `process.env.SENDGRID_API_KEY`  

Server Dependencies
-------------------

Fonts need to be present in `/usr/share/fonts` for pdf text to be selectable.

For the merging of PDFs, [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) needs to be installed.

```bash
apt-get install pdftk
cinst -y pdftk-server
```


Template testing
----------------

Location: `./templates/*.pug`

```bash
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npm run serve
```

[confac-vagrant]: https://github.com/be-pongit/confac-vagrant
