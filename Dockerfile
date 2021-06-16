FROM ubuntu:bionic

USER root

RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g yarn@1.22.10

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

#RUN yarn add segfault-handler -W
COPY . /app

# RUN yarn build:dev

# since we need our chromium to run in 'headful' mode (for testing chrome extension)
# we need a fake display (to run headful chromium), which we create by starting a Virtualized X server environment using xvfb-run
# man page for command: https://manpages.ubuntu.com/manpages/xenial/man1/xvfb-run.1.html
ENTRYPOINT ["/bin/sh", "-c", "yarn test:e2e"]
