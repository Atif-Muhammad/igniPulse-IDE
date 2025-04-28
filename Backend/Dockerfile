FROM node:22
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
RUN apt-get update && apt-get install -y python3
COPY . .
EXPOSE 9000
CMD [ "node", "app.js" ]