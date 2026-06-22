# ---- Etap 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

# najpierw manifesty (lepszy cache warstw)
COPY package*.json ./
RUN npm ci

# reszta kodu + build produkcyjny
COPY . .
RUN npm run build

# ---- Etap 2: serwowanie ----
FROM nginx:alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
# application builder Angulara wypluwa do dist/<nazwa>/browser
COPY --from=build /app/dist/movie-explorer/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]