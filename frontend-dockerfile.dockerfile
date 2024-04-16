FROM node:20.12.2 as builder
WORKDIR /project

COPY apps apps
COPY packages packages
COPY turbo.json package.json package-lock.json ./
COPY .docker-env ./.docker-env

RUN npm ci

RUN npx turbo build --filter @klofan/${APP_PROJECT_NAME}

FROM nginx:1.25.4

COPY --from=builder /project/apps/editor/dist /usr/share/nginx/html
COPY --from=builder /project/apps/editor/server.conf /etc/nginx/conf.d/default.conf
