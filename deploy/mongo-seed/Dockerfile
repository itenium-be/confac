FROM mongo:4.4.29

# Copy your sh file and adjust permissions:
COPY import.sh /docker-entrypoint-initdb.d
RUN chmod +x /docker-entrypoint-initdb.d/import.sh

CMD ["mongod"]
