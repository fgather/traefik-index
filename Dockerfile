FROM microsoft/nanoserver

ADD https://nodejs.org/dist/v9.7.1/node-v9.7.1-win-x64.zip C:\\build\\node-win-x64.zip

RUN powershell -Command Expand-Archive C:\build\node-win-x64.zip C:\; Rename-Item C:\node-v9.7.1-win-x64 node
RUN SETX PATH C:\node

COPY public c:\\server\\public
COPY bin c:\\server\\bin
COPY views c:\\server\\views
COPY routes c:\\server\\routes
COPY app.js c:\\server
COPY package.json c:\\server

RUN powershell cd c:\\server ; npm install"

EXPOSE 3000

ENTRYPOINT powershell cd c:\\server ;npm start