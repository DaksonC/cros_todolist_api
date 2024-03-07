FROM node:18

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn add hnswlib-node

COPY . .

RUN yarn prisma generate

RUN mkdir -p /usr/src/app/data && touch /usr/src/app/data/db.sqlite3

RUN yarn build

EXPOSE 3000

CMD ["node", "dist/server.js"]