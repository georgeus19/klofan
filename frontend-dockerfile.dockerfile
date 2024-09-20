FROM node:20.12.2 as builder
WORKDIR /project

COPY apps apps
COPY packages packages
COPY turbo.json package.json package-lock.json ./
COPY .docker-env ./.docker-env

RUN npm ci

RUN npm run prodbuild

FROM nginx:1.25.4

COPY --from=builder /project/apps/editor/dist /usr/share/nginx/html/editor
COPY --from=builder /project/apps/editor/server.conf /etc/nginx/conf.d/default.conf
