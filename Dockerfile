FROM node:alpine AS build_image

RUN apk update

RUN apk --no-cache add curl

RUN apk --no-cache add bash

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

WORKDIR /app

ADD package*.json /app/

RUN npm i

COPY . /app

RUN npm run build

RUN npm prune --production

RUN /usr/local/bin/node-prune

FROM node:alpine

WORKDIR /app

COPY --from=build_image /app/build ./build

COPY --from=build_image /app/package.json .

COPY --from=build_image /app/node_modules ./node_modules

# COPY --from=build_image /app/.env .

EXPOSE 5000

CMD ["npm", "start"]
