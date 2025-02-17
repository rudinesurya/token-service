FROM node:18
RUN mkdir -p /var/www/token-service
WORKDIR /var/www/token-service
ADD . /var/www/token-service
RUN npm install
CMD npm run build && npm run start:prod