FROM node:latest
WORKDIR /code
RUN mkdir /logs
COPY . .
RUN npm install
EXPOSE 3004
CMD ["node", "ESB.js"]