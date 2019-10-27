FROM node:12.13.0 as builder

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk --no-cache add python make g++

COPY package.json ./
COPY yarn.lock ./
RUN yarn
ADD . /usr/src/app
RUN yarn build

FROM node:12.13.0
WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules

COPY . .

CMD [ "yarn", "start" ]
