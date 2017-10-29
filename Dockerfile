FROM node:6.11
VOLUME ["/usr/target", "/usr/config"]
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
CMD [ "npm", "start" ]