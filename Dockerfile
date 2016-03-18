FROM node:4-onbuild
MAINTAINER <detailyang@gmail.com>

ADD . /data/cas-ldap
WORKDIR /data/cas-ldap

RUN npm install

CMD ["node", "index.js"]
