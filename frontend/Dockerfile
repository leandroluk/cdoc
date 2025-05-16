#? BUILD

FROM node:alpine AS build

WORKDIR /cdoc

#* Copy space references, domain and backend projects
COPY package.json yarn.lock ./
COPY domain                 ./domain
COPY frontend               ./frontend

#* Install all (including domain as `file:../domain` dependency)
RUN yarn install --frozen-lockfile

#* Build domain first
WORKDIR /cdoc/domain
RUN yarn build

#* Build frontend
WORKDIR /cdoc/frontend
RUN yarn build

#? DEPLOY

FROM nginx:alpine AS production

#* Copy files from project
COPY --from=build /cdoc/frontend/dist /usr/share/nginx/html

#* Expose the default port of Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]