confac
======

Node v16.10.0


Some issues at:  
https://github.com/be-pongit/confac/issues

[Try it out live][demo] (without backend:)


## Starting DEV

front/back: `npm install` followed by `npm start`

### Backend

Expects running mongo with `backend/src/config.ts` settings.  


```bash
# Start dev server
npm start

# Build project
npm run build
npm run start:build
```

## MongoDb

```bash
docker run -id -p 32772:27017 -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=pwd" -v /volume1/docker/mongo-data:/data/db --name confac-mongo mongo:3.6.3
```



## Emailing

Development: Set `SENDGRID_API_KEY` in `src/config/index.ts`  
Production: Set `process.env.SENDGRID_API_KEY`  



## Server Dependencies

Fonts need to be present in `/usr/share/fonts` for pdf text to be selectable.

For the merging of PDFs, [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) needs to be installed.

```bash
apt-get install pdftk
cinst -y pdftk-server
```


## Deployment

See `deploy/deploy.sh`



## Template testing


Location: `./templates/*.pug`

```bash
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npx http-server -o ./dist -o
```



## Junction error

`npm start` fails with weird error when run from a junction.

```text
Parsing error: Unexpected token:

React.FC<P & ButtonWithClickOnceProps>
           ^
```


[demo]: https://pongit.be/assets/confac-demo/index.html
