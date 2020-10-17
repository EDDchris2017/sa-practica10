FROM node:latest
WORKDIR /code
RUN mkdir /logs
COPY . .
RUN npm install
EXPOSE 3002
CMD ["node", "RepartidorService.js"]