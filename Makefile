app:
	yarn build
	docker compose up -d
	sleep 1
	$(MAKE) db-fresh
	yarn start:dev

db-fresh:
	yarn mikro-orm migration:up --config ./dist/shared-kernel/database/MikroORMConfig.js 
