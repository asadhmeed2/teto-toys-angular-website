# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.20.2

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

################################################
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]