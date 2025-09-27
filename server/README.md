# DMSSC Management System Server

This is the server-side application for the DMSSC Management System. It is built using TypeScript and Node.js.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the server directory:
   ```
   cd DMSSC-Management-System/server
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` file and configure your environment variables.

## Usage

To start the server, run:
```
npm start
```

The server will start on the specified port (default is 3000).

## API Endpoints

- **Dashboard**
  - `GET /api/dashboard` - Retrieve dashboard data.

- **Backlog**
  - `GET /api/backlog` - Retrieve backlog items.

- **Tasks**
  - `GET /api/tasks` - Retrieve tasks.
  - `POST /api/tasks` - Create a new task.

- **Reports**
  - `GET /api/reports` - Generate reports.

## Environment Variables

The following environment variables are required:

- `PORT` - The port on which the server will run.
- `DATABASE_URL` - The URL for the database connection.

## License

This project is licensed under the MIT License.