confac-deploy
=============

Creating `deploy/dist`:

```sh
cd deploy/build
docker build --quiet . | tail -n1 | xargs -I{} docker run --rm -v $(pwd)/../../:/confac {}
```


## Dockerizing

```sh
cd deploy
docker-compose up -d --build
```


## Versioning

```sh
docker-compose up -d --build --env-file ./.env.itenium.prod
```
