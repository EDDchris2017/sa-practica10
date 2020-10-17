FROM node:latest
WORKDIR /code
RUN mkdir /logs
COPY . .
RUN npm install
EXPOSE 3003
CMD ["node", "RestauranteService.js"]