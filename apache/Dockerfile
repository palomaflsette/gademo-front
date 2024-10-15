# Usar uma imagem baseada no Debian que tem o a2enmod
FROM debian:latest

# Instalar Apache e as dependências necessárias
RUN apt-get update && apt-get install -y \
    apache2 \
    apache2-utils \
    && apt-get clean

# Habilitar os módulos necessários do Apache
RUN a2enmod proxy && a2enmod proxy_http

# Copiar o arquivo de configuração customizado
COPY ./httpd.conf /etc/apache2/sites-available/000-default.conf

# Expor a porta 80
EXPOSE 80

# Iniciar o Apache
CMD ["apache2ctl", "-D", "FOREGROUND"]
