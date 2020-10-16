FROM node:latest
WORKDIR /code
COPY ../package*.json ./
RUN npm install
EXPOSE 3003
CMD ["node", "RestauranteService.js"]