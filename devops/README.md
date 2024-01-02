docker compose up

Pt imports:
docker cp datasets/users.csv container_id:/tmp/events.csv
docker exec -it container_id sh
mongoimport -d test -c events --file /tmp/events.csv --headerline --type csv --username=root --password=example --authenticationDatabase "admin"

or:
browser:
    - mongo-express : localhost:8081