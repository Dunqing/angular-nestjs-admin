FROM node
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install
COPY . .
# FROM nestjs/cli:latest
CMD ["yarn", "start:debug", "ela"]