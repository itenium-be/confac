FROM node:16.10.0

# Build the project:
# docker build --quiet . | tail -n1 | xargs -I{} docker run --rm -v $(pwd)/../../:/confac {}
# Result in /deploy/dist

VOLUME /confac
WORKDIR /confac

ENV REACT_APP_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

CMD ["sh", "/confac/deploy/build/build.sh"]
