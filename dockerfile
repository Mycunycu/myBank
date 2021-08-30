FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install NPM
COPY package.json /usr/src/app/
RUN npm install

RUN mkdir -p '/usr/src/app/storage/logs'

# Bundle app source
COPY . /usr/src/app
EXPOSE 8808

CMD ["npm","start"]