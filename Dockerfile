FROM 218.201.251.104:15000/library/node:8
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g pm2

RUN mkdir -p /usr/src/app
COPY ./code/bpm /usr/src/app

WORKDIR /usr/src/app

RUN npm install
COPY ./modules /usr/src/app/node_modules

EXPOSE 30002
CMD ["npm","start"]
