# frontend/Dockerfile
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx to serve the built frontend
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
