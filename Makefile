build:
	docker build . -t shouryade/cryptic-backend
run:
	docker ps -aq --filter 'name=cryptic-backend' | xargs -I {} docker rm -f {}
	docker run --name cryptic-backend -p 5000:5000 -d shouryade/cryptic-backend
setup-nginx:
	sudo cp cryptic-backend.conf /etc/nginx/sites-available/
	sudo ln -fs /etc/nginx/sites-available/cryptic-backend.conf /etc/nginx/sites-enabled/
	sudo nginx -t
	sudo systemctl reload nginx