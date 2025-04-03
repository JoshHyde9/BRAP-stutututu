FROM nginx:latest

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/nginx.conf

# Create and set permissions for our config
COPY ./default.conf /etc/nginx/conf.d/
RUN chmod 644 /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/
RUN chmod 644 /etc/nginx/nginx.conf

# Add custom entrypoint
COPY entrypoint.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/entrypoint.sh