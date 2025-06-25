FROM node:lts-alpine AS builder

WORKDIR /app
COPY . .

WORKDIR /app/SERVER
RUN npm install --arch=x64 --platform=linuxmusl sharp
RUN corepack enable
RUN corepack install
RUN yarn install && yarn run build && rm -rf node_modules

WORKDIR /app/CLIENT
RUN yarn install && yarn run build && rm -rf node_modules

WORKDIR /app/ADMIN
RUN yarn install && yarn run build && rm -rf node_modules

FROM node:lts-alpine

WORKDIR /app

RUN npm install --arch=x64 --platform=linuxmusl sharp

COPY --from=builder /app/SERVER/dist .
COPY --from=builder /app/CLIENT/dist ./public
COPY --from=builder /app/ADMIN/dist ./public/admin

ENV HOST 0.0.0.0
ENV PORT 8000
ENV MOIEN_DATABASE_HOST=db.cjspwqqhdpkjmqycwxys.supabase.co
ENV MOIEN_DATABASE_PASSWORD=XFwDDY6uj2uhCrqFr6cJjaFQyjuaR8L7
ENV MOIEN_DATABASE_URL=https://cjspwqqhdpkjmqycwxys.supabase.co
ENV MOIEN_DATABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bWFsdHF2eG5tdHZsamxnaGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2MzAxNDIsImV4cCI6MjAxMTIwNjE0Mn0.qjhCx3-VpASYblLdm_GSZmNWEHj5tTUU3LPL04X2N8Q
ENV SECRET_MOIEN_STORAGE_URL=https://cjspwqqhdpkjmqycwxys.supabase.co/storage/v1/object/public
ENV NODE_ENV=development
ENV MAILCHIMP_LIST_ID=3cc380c624

EXPOSE 8000

CMD ["node", "index.js"]
