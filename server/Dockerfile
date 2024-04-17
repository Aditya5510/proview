FROM node:lts

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
COPY .env.docker .env

CMD ["npm", "start"]
