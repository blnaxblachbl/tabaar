# Docker Container Quick Start

### If you don't have an any existing PostgreSQL and Elastcisearch databases, you can use this instrutions:

1. Copy [docker-componse.yml](docker-compose.yml) file to your server
2. Copy [.env](env), [.env.tabaar-service](env.tabaar-service) and [.env..tabaar-dashboard](env..tabaar-dashboard) file to your server. Do not forget add dots at the begining.
3. Configurate ENV files. 
4. Create "data" folder.
5. Hit compose command:
   ```bash
   docker compose up -d
   ```
5. Copy ./data/certs/ca/ca.crt and update .env.tabaar-service ELASTIC_CA with sertificate.
6. Restart container using command:
   ```bash
   docker compose up -d
   ```
7. Thats is

### If you want to connect to existing instances, please follow current [instructions](../README.md).
