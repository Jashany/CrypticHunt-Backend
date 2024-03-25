build:
	docker build . -t shouryade/cryptic-backend
run:
	docker run --name cryptic-backend -p 5000:5000 -d shouryade/cryptic-backend