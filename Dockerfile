FROM node:14.10-stretch

EXPOSE 8000

WORKDIR /src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN ["node", "init.js"]

CMD ["node", "server.js"]
