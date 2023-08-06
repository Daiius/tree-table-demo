FROM mysql:8.0.32-debian

COPY minimal_memory.conf /etc/mysql/conf.d/
COPY create_tables.sql /docker-entrypoint-initdb.d/

