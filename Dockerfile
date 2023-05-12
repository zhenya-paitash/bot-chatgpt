# node.js образ
FROM node:16-alpine

# утсановка рабочего каталога 
WORKDIR /app

# копирование package.json & package-lock.json в рабочую область
COPY package*.json ./

# установка зависимостей
RUN npm ci

# копирование остальных файлов/каталогов в рабочую область
COPY . .

# устрановка переменных окружения
ENV PORT=3000

# объявление порта, который будет использовать приложение
EXPOSE $PORT

# запуск приложения
CMD ["npm", "start"]