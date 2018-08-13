FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @angular/cli@1.7.1
COPY . /usr/src/app
EXPOSE 4200:4200
CMD ng serve --host 0.0.0.0