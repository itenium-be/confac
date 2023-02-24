FROM node:16.10.0

# gnupg ?

# TODO: need to go to pongit and see how the build looks like on the file system
# TODO: how is the frontend served...
# TODO: merge the frontend/backend git repos

RUN apt-get update && \
  apt-get install -y build-essential libfontconfig && \
	# Pdf Toolkit for pdf merging
	apt-get install -y pdftk

# TODO: load entire env file?
# TODO: how to pass env to node?
# --> Ideally this is added later!

# ENV MONGO_HOST=192.168.1.2 \
# 	MONGO_DB=confac \
# 	MONGO_PORT=32772 \
# 	MONGO_USERNAME=admin \
# 	MONGO_PASSWORD= \
# 	ENABLE_ROOT_TEMPLATES=1 \
# 	SERVER_HOST=192.168.1.2 \
# 	PORT=9000 \
# 	SERVER_BASEPATH= \
# 	SENDGRID_API_KEY= \
# 	GOOGLE_CLIENT_ID= \
# 	GOOGLE_SECRET= \
# 	GOOGLE_DOMAIN= \
# 	JWT_SECRET= \
# 	JWT_EXPIRES=18000 \
# 	SUPERUSER=


EXPOSE 9000

# TODO: put the jenkins script here
# http://pongit:9001/job/confac-back/configure
COPY dist/public /home


# TODO: Frontend should be in /public
# http://pongit:9001/job/confac-front/configure

VOLUME /templates


# Need to copy fonts used in templates locally or
# the text inside the pdf will not be selectable.
VOLUME /usr/share/fonts

# COPY FONT/* /usr/share/fonts

WORKDIR /home
CMD ["node", "./server.js"]
