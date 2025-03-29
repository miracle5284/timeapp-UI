# Build stage
FROM node:23-alpine as build
WORKDIR /app
COPY timeapp-ui ./timeapp-ui
WORKDIR /app/timeapp-ui
RUN npm ci
RUN npm run build

# Serve stage
FROM nginx:alpine

# Create a non-root user to run nginx
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser

RUN mkdir -p /app/www

COPY --from=build /app/timeapp-ui/dist /app/www
COPY nginx/default.conf /etc/nginx/templates/default.conf.template
COPY timeapp-ui/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Set correct permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

EXPOSE 80

ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=80

USER webuser

CMD ["nginx", "-g", "daemon off;"]
