FROM node:20


WORKDIR /app
COPY package*.json ./

ENV NODE_OPTIONS=--max_old_space_size=4096

RUN npm install

COPY ./src /app
COPY ./prisma /app

# API Server
EXPOSE 4040

# Node debug
EXPOSE 9229

