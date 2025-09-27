# DMSSC Management System

## Overview
The DMSSC Management System is a comprehensive application designed to manage various aspects of a project, including tasks, backlog, and reports. This project is divided into two main components: the server and the client.

## Project Structure
```
DMSSC-Management-System
├── server
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   └── index.ts
│   │   ├── routes
│   │   │   └── index.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── client
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   │   └── index.tsx
│   │   ├── pages
│   │   │   └── Home.tsx
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

## Server Component
The server component is built using TypeScript and provides the backend functionality for the application. It includes:

- **API Endpoints**: Routes for managing tasks, backlog, dashboard, and reports.
- **Database Seeding**: Sample data for development and testing.
- **Environment Configuration**: Example environment variables for configuration.

### Setup Instructions
1. Navigate to the `server` directory.
2. Install dependencies using `npm install`.
3. Create a `.env` file based on the `.env.example` provided.
4. Start the server with `npm start`.

## Client Component
The client component is built using React and provides the frontend interface for users to interact with the application. It includes:

- **Routing**: Logic to navigate between different views.
- **Views**: Components for dashboard, backlog, tasks, and reports.
- **Styling**: CSS files for consistent styling across the application.

### Setup Instructions
1. Navigate to the `client` directory.
2. Install dependencies using `npm install`.
3. Start the client application with `npm start`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.