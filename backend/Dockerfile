#?-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
#? WORKSPACE 
#?-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

FROM node:alpine AS workspace
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

WORKDIR /cdoc

#* Copy workspace references, domain and backend projects
COPY package.json yarn.lock ./
COPY backend                ./backend
COPY domain                 ./domain

#* Install all (including domain as `file:../domain` dependency)
RUN yarn install --frozen-lockfile

#* Build domain first
WORKDIR /cdoc/domain
RUN yarn build

#* Build only the APP_NAME
WORKDIR /cdoc/backend
RUN yarn build:${APP_NAME}

#?-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
#? PROJECT
#?-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

FROM node:alpine AS project
ARG APP_NAME
ENV APP_NAME=${APP_NAME} NODE_ENV=production

WORKDIR /cdoc

#* Copy only `backend` dependencies
COPY ./backend/package.json ./backend/package.json

#* Copy only compiled code of `domain` to resolve the backend dependency
COPY --from=workspace /cdoc/domain/dist ./domain/dist

#* Install only production dependencies of `backend`
WORKDIR /cdoc/backend
RUN yarn install --production --frozen-lockfile

#?-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
#? PRODUCTION
#?-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

FROM node:alpine AS production
ARG APP_NAME
ENV APP_NAME=${APP_NAME} NODE_ENV=production

WORKDIR /cdoc

#* Copy only the compiled files of APP_NAME
COPY --from=workspace /cdoc/backend/dist/apps/${APP_NAME} ./dist

#* Copy node_modules from *deps* stage
COPY --from=project /cdoc/backend/node_modules ./node_modules

#* Entrypoint of app
CMD ["node", "dist/main.js"]