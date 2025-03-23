FROM nginx:1.27
RUN apt update --assume-yes
# RUN apt install --assume-yes vim openssh-server python3 python3-venv libaugeas0 supervisor
RUN apt install --assume-yes vim openssh-server certbot python3-certbot-nginx wget supervisor cron
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN mkdir -p /run/sshd && ssh-keygen -A
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN mkdir -p /root/.ssh && touch /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys
ARG SSH_PUB_KEY
# RUN echo debug "$SSH_PUB_KEY"
RUN echo "$SSH_PUB_KEY" > /root/.ssh/authorized_keys
COPY prod_dist_root_domain /usr/share/nginx/html/interval_stopwatch
COPY nginx_interval_stopwatch_root_domain.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 22  
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]