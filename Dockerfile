FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

#Lets serve the applications with nginx

FROM nginx:alpine
#copy files from build to nginx
COPY --from=build /app/dist/nexus-ai-hub/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]