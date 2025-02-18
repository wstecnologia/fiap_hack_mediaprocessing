FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash curl

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]