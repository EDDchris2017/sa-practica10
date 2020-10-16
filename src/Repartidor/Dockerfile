FROM node:latest
WORKDIR /code
COPY ../package*.json ./
RUN npm install
EXPOSE 3002
CMD ["node", "RepartidorService.js"]