FROM ubuntu:bionic

USER root

RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g yarn@1.22.10

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

COPY . /app

#ENTRYPOINT ["/bin/sh", "-c", "node node_modules/jest/bin/jest.js --detectOpenHandles settings-drop-down"]
ENTRYPOINT ["/bin/sh", "-c", "yarn test:e2e"]
