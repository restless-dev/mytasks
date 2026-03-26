# MyTasks
![MyTasks](https://github.com/user-attachments/assets/42e3e9a2-db48-4e1a-843f-dc041a8bcee1)
MyTasks is a robust **Kanban Task Manager web application**, built with the **PEAN** stack (PostgreSQL, Express, Angular, Node.js). It offers registered users a complete **project management dashboard**, allowing them to organize their workflow through a visual board system.

Users can create and customize multiple boards, columns, and manage tasks using an intuitive **Drag & Drop interface**. To ensure data privacy, the system implements secure authentication, ensuring users only access their own boards and data.
## Features
#### Secure Authentication: Create an account and log in securely using JWT (JSON Web Tokens).
https://github.com/user-attachments/assets/cf14004f-6593-4f88-aeb1-cccd8618cd45

#### Multi-Board Management: Create, rename, and delete multiple boards to organize different projects.
https://github.com/user-attachments/assets/bf3f3eef-3415-424b-967a-0df5141c99b4

#### Drag & Drop Interface: Smoothly move tasks between columns (e.g., Todo -> Doing -> Done) using Angular CDK.
https://github.com/user-attachments/assets/e58287b4-9af2-4a2c-a266-b839d93daccb

#### Customizable Structure: Add, edit, and delete columns to fit your specific workflow.
https://github.com/user-attachments/assets/2a24fe6a-ee5b-4c9b-9fae-95eff69a94d7

#### Task Details: Create tasks with titles, descriptions, icons, and mark them as "Urgent" for visual priority.
https://github.com/user-attachments/assets/eb6cfdb7-3e3b-428d-8392-3c3176922e52

#### Personalization: Assign custom Icons to boards, columns, and tasks for better visual recognition.
https://github.com/user-attachments/assets/1717f410-6b35-463e-81a4-5392a12cb668

#### User Experience: Toggle between Light and Dark modes, with a responsive design and smooth CSS animations.
https://github.com/user-attachments/assets/ed70e294-fb41-4c2a-b5d8-30505829a829

#### Profile Management: Update your username and manage your session directly from the app.
https://github.com/user-attachments/assets/47196f92-695d-40e8-95ca-d5119bdb2a33

## Operation & Stack
### Server

The server folder contains the backend logic, API endpoints, and database interactions.

The backend acts as a RESTful API, processing client requests, handling business logic (like verifying task ownership), and interacting with the database via Prisma ORM.

The main technologies used here are:

**Node.js & Express**: Handles HTTP requests, routing, and middleware logic.

**TypeScript**: Ensures type safety and code reliability across the backend.

**PostgreSQL**: Relational database used to store Users, Boards, Columns, and Tasks with strict referential integrity.

**Prisma ORM**: Used for schema definition, migrations, and type-safe database queries.

**Bcrypt**: Hashes user passwords before storage to ensure security.

**Json Web Token (JWT)**: Manages user sessions and protects private API routes.
### Client

The client folder contains the frontend application built with Angular 17+.

The frontend provides a reactive, single-page application (SPA) experience. It utilizes modern Angular features like Signals for state management to ensure the UI stays in sync with the backend instantly (Optimistic UI).

The main technologies used here are:

**Angular**: The core framework for the UI, utilizing Standalone Components and Signals. The Angular CDK provides the logic for the complex Drag and Drop interactions on the board.

**Tailwind CSS**: Utility-first CSS framework used for styling, including a semantic design system for theming (Light/Dark mode).

**RxJS**: Handles asynchronous data streams and HTTP requests.

**Ngx-Emoji-Mart**: Integrated picker for selecting custom icons.

### Database

This project uses PostgreSQL running inside a Docker Container.

The database schema is managed by Prisma. It relies on a relational structure where:

    A User has many Boards.

    A Board has many Columns.

    A Column has many Tasks.

To run the database locally without installing PostgreSQL on your machine, the project includes a docker-compose.yml file.
## How to Run

This project requires Docker, Node.js, and NPM installed.
#### 1. Clone the project:
```
git clone https://github.com/restless-dev/mytasks.git
cd mytasks
```
#### 2. Start the Database (Docker):
From the root folder, spin up the PostgreSQL container:
```
docker-compose up -d
```
#### 3. Setup the Backend:
Navigate to the server folder, install dependencies, and set up the database schema.
```
cd server
npm install
```
Create a .env file in the server folder based on .env.example (or set DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mytasks?schema=public").

Run the migrations to create the tables:
```
npx prisma migrate dev
```
Start the server:
```
npm run dev
```
#### 4. Setup the Frontend:

Open a new terminal, navigate to the client folder, and install dependencies.
```
cd client
npm install
```
Start the Angular application:
```
npm start
```
The application will be available at http://localhost:4200

The backend API will be running at http://localhost:3000.
