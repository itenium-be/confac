confac-back
===========

Starting DEV
------------

Expects running mongo with `src/config.ts` settings.  


```bash
# Start dev server
npm start

# Build project
npm run build
npm run start:build
```



MongoDb
-------

```bash
docker run -id -p 27010:27017 -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=pwd" --name confac-mongo mongo
```



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
npx http-server -o ./dist -o
```
