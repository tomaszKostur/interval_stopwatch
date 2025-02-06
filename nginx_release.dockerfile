FROM nginx:1.27
COPY prod_dist /usr/share/nginx/html/interval_stopwatch
COPY nginx_interval_stopwatch.conf /etc/nginx/conf.d/nginx_interval_stopwatch.conf
# RUN rm etc/nginx/conf.d/default.conf