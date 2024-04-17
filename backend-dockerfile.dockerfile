FROM node:20.12.2 as builder
WORKDIR /project

COPY apps apps
COPY packages packages
COPY turbo.json package.json package-lock.json ./
COPY .docker-env ./.docker-env

RUN npm ci

RUN npm run build

ENTRYPOINT node --env-file /project/.docker-env /project/apps/${APP_DIRECTORY}/dist/main.js
