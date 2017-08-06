FROM node:7.10.1

WORKDIR /src

RUN apt-get update && apt-get --yes install netcat-openbsd

# use changes to package.json to force Docker not to use the cache
# when we change our application's dependencies:
ADD package.json /tmp/package.json
RUN cd /tmp && npm i
RUN mkdir -p /src && cp -a /tmp/node_modules /src

ADD . /src

CMD ["npm", "run", "start"]
