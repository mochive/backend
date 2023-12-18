FROM alpine:latest

WORKDIR /application

COPY package.json /application
COPY distribution /application/distribution

RUN apk add --no-cache nodejs npm
RUN npm install --force --omit=dev
RUN apk del npm
RUN rm -r package.json package-lock.json node_modules/@types
RUN find node_modules -type f \( -iname "*.ts" -o -iname "*.md" \) ! -iname "LICENSE.md" -delete
RUN find node_modules -type d -empty -delete

ENTRYPOINT ["node", "distribution/application.js"]