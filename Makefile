
app:
	docker compose up -d
	sleep 1
	yarn mikro-orm migration:fresh
	yarn start:dev

db-fresh:
	yarn mikro-orm migration:fresh
