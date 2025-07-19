# ClearCart
Full-stack implementation of the "ClearCart" product rental application. Features include user registration, product CRUD, and a rental/purchase system. Tech Stack: React, Apollo Client, Spring Boot, GraphQL, PostgreSQL, and Docker.

## Features

### Authentication
- As a new user, I can register for an account.
- As an existing user, I can log in to my account.

### Product Management
- As a logged-in user, I can add a new product via a multi-step form.
- As a logged-in user, I can edit the details of a product I own.
- As a logged-in user, I can delete a product I own.

### Marketplace
- As a user, I can see a list of all available products from all users (with pagination).
- As a user, I can buy a product.
- As a user, I can rent a product for a specific date range.

### User Dashboard
- As a logged-in user, I can see a paginated list of all products I have bought, sold, lent, and rented.

---

## Getting Started with ClearCart

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. All required configuration is self-contained in the `docker-compose.yml` file.

### Prerequisites

You must have the following software installed on your machine:
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### 1. Running the Application

**A. Build the Docker Images**

From the project's root directory, run the `build` command. This will build the Docker images for both the frontend and backend services.

```bash
docker-compose build
```
*(This may take a few minutes on the first run as it downloads base images and project dependencies.)*

**B. Start the Services**

Once the images are built, start all the services (database, backend, frontend) in detached mode (`-d`):

```bash
docker-compose up -d
```

You can check the status of your running containers with:
```bash
docker-compose ps
```

### 2. Accessing the Application

Once all services are up and running, you can access the application:

-   **Frontend (ClearCart App):** [http://localhost:5173](http://localhost:5173)
-   **Backend (GraphQL Playground):** [http://localhost:8080/graphql](http://localhost:8080/graphql) *(Useful for API testing)*

### 3. Stopping the Application

To stop all the running services, use the `down` command. This will stop and remove the containers.

```bash
docker-compose down
```

To stop the services and also **remove the database volume** (for a complete data reset), add the `-v` flag:
```bash
docker-compose down -v
```
---

### Project Structure
```
.
├── backend/            # Spring Boot Application (Java)
│   ├── src/
│   └── Dockerfile
├── frontend/           # React Application (JavaScript)
│   ├── src/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml  # Docker orchestration file
└── README.md           # This file
```

## API Testing

You can use the provided [ClearCart.postman_collection.json](./ClearCart.postman_collection.json) file to test the backend API endpoints via [Postman](https://www.postman.com/).  
After importing, run requests as needed.
