confac
======

## Version Lock-In

We're locked into these versions (for the backend):  
Node **v16.10.0**, TypeScript v4.3 and mongodb **v3.5.8**  
- Could attempt to upgrade mongodb to v4.4.1
- This is the lastest version of mongo that does not require VAX which our production server doesn't have
- For later versions of mongo the @types/mongodb is no longer necessary but there are breaking changes
  - ex: ObjectId -> ObjectID


## Starting DEV

front/back: `npm install` followed by `npm start`

### Backend

Expects a running mongo with `backend/src/config.ts` settings.  
Create a development `.env` file to change the default config.

```bash
# Start dev server
cd backend
cp .env.sample .env
cp -r templates-example templates
npm install
npm start
```

## MongoDb

```bash
docker volume create mongodata
docker run -id -p 27017:27017 -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=pwd" -v mongodata:/data/db --name confac-mongo mongo:3.6.3
```

### Migrations

```sh
cd deploy
npm install
npm run create some-name
npm run up

# Or on server:
cd deploy
./migrate.sh
```


## Server Dependencies

Fonts need to be present in `/usr/share/fonts` for pdf text to be selectable.

For the merging of PDFs, [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/) needs to be installed.

```bash
apt-get install pdftk
cinst -y pdftk-server
```


## Deployment

See `deploy/deploy.sh`


### Seeding random data

Configure amounts in `backend/src/faker/faker-config.ts`
Mongo db credentials are read automatically from the env file.

```sh
cd backend
npm run faker
```


## Template testing


Location: `./templates/*.pug`

```bash
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npx http-server -o ./dist -o
```
