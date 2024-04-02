FROM node:21-bookworm-slim

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install pm2 -g
EXPOSE 5000
CMD ["pm2-runtime", "index.js"]