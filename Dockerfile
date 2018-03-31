FROM node:alpine

COPY public /server/public
COPY bin /server/bin
COPY views /server/views
COPY routes /server/routes
COPY app.js /server
COPY package.json /server

RUN cd /server ; npm install

EXPOSE 3000

ENTRYPOINT cd /server; npm start