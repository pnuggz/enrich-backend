FROM node:12.13.0 as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./usr/src/app
COPY yarn.lock ./usr/src/app
RUN yarn

FROM node:12.13.0
WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules

ADD . /usr/src/app
RUN yarn build

COPY . .

CMD [ "yarn", "start" ]
