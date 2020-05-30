FROM keymetrics/pm2:latest-alpine
WORKDIR /app
ENV REDIS_HOST=redis
ENV MONGO_HOST=mongo
COPY package.json yarn.lock pm2.json ./
RUN yarn install --production
COPY . .
RUN yarn build ela
# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
# RUN npm install --production
RUN pm2 install pm2-auto-pull
# RUN pm2 install pm2-server-monit
# EXPOSE 80
# EXPOSE 443
# EXPOSE 43554
# Show current folder structure in logs
# RUN ls -al -R
RUN ls -a

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]