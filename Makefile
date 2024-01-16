app:
	docker compose up -d
	sleep 1
	ngrok http 5000
	yarn mikro-orm migration:fresh
	yarn start:dev

db-fresh:
	yarn mikro-orm migration:fresh
