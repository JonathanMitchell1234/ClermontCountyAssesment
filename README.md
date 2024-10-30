# User Management Application

  ![appgif](https://github.com/user-attachments/assets/55adfce6-6912-40b5-be16-c6831d6a7974)


## Prerequisites

- [Docker](https://www.docker.com/get-started)

- [Docker Compose](https://docs.docker.com/compose/install/)
- [MySQL](https://www.mysql.com/downloads/)

 ## Clone the Repository

    git clone https://github.com/JonathanMitchell1234/ClermontCountyAssesment.git

## Setup Database

1. Navigate to the project directory in your terminal.

2. Run the following command to start the MySQL database:

  

```bash

docker-compose up -d

```

	Alternatively, use the build_database.sql script to build 
	the database manually

  

## Build and Run Backend Service

1. Build the Docker image for the backend service by navigating to the ClermontBackend Directory:

  

```bash

docker build -t backend-service .

```

  

2. Run the backend service container:

  

```bash

docker run -d -p 5153:5153 --name backend_service backend-service

```

  

## Access the Application

1. Open `index.html` in your preferred web browser or use a live server extension in a development environment.

2. Ensure that the backend service is running and accessible at `http://localhost:5153`.

## Admin Panel Login
Since this is not a production environment application and is only a demo, the username and password to login has been set simply to:

    Username: admin
    Password: admin
    

  

## Stopping the Application

- To stop the database and backend service, execute:

  

```bash

docker-compose down

docker stop backend_service

docker rm backend_service

```

  

## Notes

- The database initialization script `BUILD_DATABASE.SQL` is automatically executed when the MySQL container starts.

- Ensure that ports `3306` and `5153` are not occupied by other services on your machine.
