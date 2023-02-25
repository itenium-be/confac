FROM node:16.10.0

# gnupg ?

RUN apt-get update && \
  apt-get install -y build-essential libfontconfig && \
	# Pdf Toolkit for pdf merging
	apt-get install -y pdftk

EXPOSE 9000

COPY dist /home
VOLUME /templates

# Need to copy fonts used in templates locally or
# the text inside the pdf will not be selectable.
VOLUME /usr/share/fonts


WORKDIR /home
CMD ["node", "./server.js"]
