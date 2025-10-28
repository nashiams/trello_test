FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Run prestart (migrations) via package.json prestart, then start server (bin/www).
CMD ["npm", "run", "start"]
