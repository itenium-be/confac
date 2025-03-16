FROM node:22.12.0

RUN apt-get update && \
  apt-get install -y build-essential libfontconfig && \
	# Pdf Toolkit for pdf merging
	apt-get install -y pdftk

EXPOSE 7000
VOLUME /templates

# Need to copy fonts used in templates locally or
# the text inside the pdf will not be selectable.
VOLUME /usr/share/fonts

COPY dist /home
WORKDIR /home
CMD ["node", "./server.js"]
