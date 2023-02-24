# build stage
FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


#prod stage
FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist ./dist

COPY package*.json ./

RUN npm install --only=prod

RUN rm package*.json

EXPOSE 3000

CMD ["node", "dist/main"]