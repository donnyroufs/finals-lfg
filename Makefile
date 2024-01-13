
app:
	docker compose up -d
	yarn mikro-orm migration:fresh
	yarn start:dev
