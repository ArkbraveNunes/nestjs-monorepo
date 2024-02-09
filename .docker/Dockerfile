FROM node:18-alpine AS builder

ARG APP_NAME

RUN npm install -g npm@latest

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build -- ${APP_NAME}

ENV NODE_ENV production

RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

RUN npm prune

FROM node:18-alpine AS production

ARG APP_NAME \
  APP_VERSION

WORKDIR /usr/src/app

ENV APP_VERSION ${APP_VERSION}

COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist/apps/${APP_NAME}/main.js .

CMD [ "node", "main.js" ]
