FROM node:18

WORKDIR /usr/src/app 

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn add hnswlib-node

COPY . .

RUN yarn build 

EXPOSE 3000  

CMD ["node", "dist/server.js"]