FROM nginx

WORKDIR /usr/share/nginx/html

COPY index.html dist/bundle.js /usr/share/nginx/html
COPY src/login/index.html dist/login_bundle.js /usr/share/nginx/html/login/
COPY nginx.conf /etc/nginx/nginx.conf

