# PERSONAL HOMEPAGE 2025

This is the repository for my personal homepage, which is built using Next.js and NestJS.
The homepage is designed to showcase my projects, blog posts, and other personal content.
The homepage is hosted on Railway and uses Supabase for the database.

## Technologies Used

- **TypeScript**: For both frontend and backend development, ensuring type safety and better developer experience.
- **Tailwind CSS**: For styling the frontend, providing a modern and responsive design.
- **Prisma**: As the ORM for database interactions, simplifying data management and migrations.
- **PostgreSQL**: As the database, providing a reliable and scalable data storage solution
- **Next.js**: For the frontend, providing a fast and responsive user interface.
- **NestJS**: For the backend, offering a robust API to handle requests and manage data.
- **Vite**: For building the frontend, ensuring a smooth development experience with fast hot module replacement.
- **Supabase**: As the database solution, providing real-time capabilities and easy integration.
- **Docker**: For containerization, making it easy to deploy and manage the application.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/personal-homepage-2025.git
   cd personal-homepage-2025
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a reference.

4. Start the development server:
   ```bash
   pnpm dev
   ```
   will start both the website, admin and backend servers. The website will be available at `http://localhost:4200`, admin at `http://localhost:4300` and backend at `http://localhost:5000`.

## Run in docker

To run the application in Docker, you can use the provided `docker-compose.yml` file. Make sure you have Docker and Docker Compose installed.

1. Copy the `env.example` file to `.env` in the root directory and update the environment variables as needed.

2. Run the following command to start the application:

   ```bash
   docker-compose up --build
   ```

3. The application will be available under addresses configured in `.env` file.

## Orchestration with docker-swarm

To deploy the application using Docker Swarm, you can use the provided `docker.compose.stack.yml` file. Make sure you have Docker Swarm initialized.

1. Copy the `env.example` file to `.env` in the root directory and update the environment variables as needed.

2. Run the following command to deploy the application:

   ```bash
   env $(cat .env.prod | xargs) envsubst < docker-compose.stack.yml | docker stack deploy -c - --detach=true ph

   ```

3. The application will be available under addresses configured in swarm nodes parameters. Especially, variables `PUBLIC_URL`, `FRONTEND_URL` and `ADMIN_URL` should be set to the public addresses of the respective services in order to be accessible from outside the swarm and to meet CORS policy. Details are depending on your infrastructure.

4. Moreover, you can use the `visualizer` service to monitor the Docker Swarm cluster.

For example, if you want to test this setup with **[Play with Docker](https://labs.play-with-docker.com/)**, use current session url as _"localhost"_ in `.env.prod` file.

**Note**: The `docker.compose.stack.yml` file is designed to be run with minimal configuration. It uses hardcoded environment variables, which should be adjusted in production use, especially secrets, ie. `JWT_SECRET`.
