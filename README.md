confac
======

## Version Lock-In

We're locked into these versions (for the backend):
mongodb **v3.5.8**
- Could attempt to upgrade mongodb to v4.4.1
- This is the latest version of mongo that does not require AVX which our production server doesn't have
- For later versions of mongo the @types/mongodb is no longer necessary but there are breaking changes
  - ex: ObjectId -> ObjectID


## Starting DEV

- Backend: `bun install` followed by `bun start`
- Frontend: `bun install` followed by `bun start`

### Backend

Expects a running mongo with `backend/src/config.ts` settings.  
Create a development `.env` file to change the default config.

```bash
# Start dev server
cd backend
cp .env.sample .env
cp -r templates-example templates
bun install
bun start
```

## MongoDb

```bash
docker volume create mongodata
docker run -id -p 27017:27017 -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=pwd" -v mongodata:/data/db --name confac-mongo mongo:3.6.3
```

### Migrations

```sh
cd deploy
bun install
bun run create some-name
bun run up
```

On the server, migrations are handled by `./deploy.sh`.


## PDF fonts (Gotenberg)

Custom PDFs fonts must be in `FONT_PATH`.

**After adding or replacing a font file on the host**:

```bash
CONFAC_ENV=prod
docker exec -u 0 confac-$CONFAC_ENV-gotenberg fc-cache -f
docker restart confac-$CONFAC_ENV-gotenberg
docker exec confac-$CONFAC_ENV-gotenberg fc-match "Your Family Name"

# If the file is there but gotenberg doesn't see it, check permissions
sudo chmod -R a+rX "$FONT_PATH"
```

## Deployment

See `deploy/deploy.sh`


### Seeding random data

Mongo db credentials are read automatically from the env file.

```sh
cd backend
bun run faker
```

## Billit (Peppol)

- [Billit Status](https://status.billit.be/)
- Sandbox:
  - [API](https://api.sandbox.billit.be/)
  - [UI](https://my.sandbox.billit.be/)
- Production:
  - [API](https://api.billit.be/)
  - [UI](https://my.billit.be/)
- [Swagger](https://api.billit.be/swagger/ui/index)
- [Docs](https://docs.billit.be/)
- [AccessPoint Docs](https://docs.accesspoint.billit.eu/)
