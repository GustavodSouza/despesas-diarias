FROM node:18 AS build

WORKDIR /app

COPY . .

RUN npm install -g @quasar/cli

RUN npm install

RUN quasar build

FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
