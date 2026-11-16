
# Use a pinned, unprivileged NGINX image
FROM nginx/nginx-unprivileged:1.31.8-alpine3.24

# Identify the source code version
ARG BUILD_SHA=local
ENV BUILD_SHA=${BUILD_SHA}

# Temporarily use root for build-time file cleanup
USER root

# Remove the default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy static website files with NGINX ownership
COPY --chown=101:101 index.html cheet.css cheet.js commands.js /usr/share/nginx/html/

# Copy the NGINX configuration template
COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf.template

# Return to the unprivileged NGINX user
USER 101

# NGINX listens on port 8080
EXPOSE 8080

# Docker health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/healthz"]
# Generate configuration and start NGINX
CMD ["/bin/sh", "-c", "envsubst '${BUILD_SHA}' < /etc/nginx/conf.d/default.conf.template > /tmp/default.conf && cp /tmp/default.conf /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
