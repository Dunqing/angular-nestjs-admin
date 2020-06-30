FROM keymetrics/pm2:latest-alpine
WORKDIR /app
ENV REDIS_HOST=redis
ENV MONGO_HOST=mongo
ENV MONGO_HOST=mongo
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY txhhinutbl8en0o
ENV PM2_SECRET_KEY zvtz2lcn2h81ufk
COPY package.json yarn.lock pm2.json ./
RUN yarn install
COPY . .
RUN yarn build nga
# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
# RUN npm install --production

RUN pm2 install pm2-auto-pull
RUN pm2 install pm2-server-monit

# EXPOSE 80
# EXPOSE 443
# EXPOSE 43554
# Show current folder structure in logs
# RUN ls -al -R
RUN ls -a

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]