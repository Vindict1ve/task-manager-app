# Task Manager Application

A full-stack task management application built with Node.js, Express, React, and SQLite.

## Features

- Create, read, update, and delete tasks
- Mark tasks as pending or completed
- Clean and intuitive user interface
- RESTful API backend
- Persistent data storage with SQLite

## Tech Stack

**Backend:**
- Node.js
- Express.js
- SQLite3
- CORS & Body-Parser

**Frontend:**
- React
- Axios
- CSS3

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

The backend server will start on `http://localhost:5000`

**For development with auto-reload:**
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The React app will open automatically in your browser at `http://localhost:3000`

## Project Structure

```
task-manager-app/
├── backend/                 # Express backend
│   ├── routes/
│   │   └── tasks.js        # Task API routes
│   ├── database.js         # SQLite configuration
│   ├── server.js           # Express server
│   └── package.json
│
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
│
├── CLAUDE.md              # Technical documentation
└── README.md              # This file
```

## API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | /api/tasks       | Get all tasks        |
| GET    | /api/tasks/:id   | Get task by ID       |
| POST   | /api/tasks       | Create new task      |
| PUT    | /api/tasks/:id   | Update task          |
| DELETE | /api/tasks/:id   | Delete task          |

## Usage

### Creating a Task
1. Enter a title in the "Title" field (required)
2. Optionally add a description
3. Click "Create Task"

### Editing a Task
1. Click the "Edit" button on any task
2. Modify the title or description
3. Click "Update Task"

### Changing Task Status
- Click "Mark Complete" to mark a pending task as completed
- Click "Mark Pending" to revert a completed task to pending

### Deleting a Task
1. Click the "Delete" button on any task
2. Confirm the deletion in the popup dialog

## Task Schema

Each task has the following properties:

```javascript
{
  id: number,              // Auto-generated
  title: string,           // Required
  description: string,     // Optional
  status: string,          // 'pending' or 'completed'
  createdAt: datetime,     // Auto-generated
  updatedAt: datetime      // Auto-updated
}
```

## Development

### Backend Development

The backend uses:
- Express for routing and middleware
- SQLite3 for database operations
- CORS for cross-origin requests
- Body-parser for request parsing

Database file is created at: `backend/tasks.db`

### Frontend Development

The frontend uses:
- React Hooks for state management
- Axios for HTTP requests
- Functional components
- CSS for styling

The frontend is configured to proxy API requests to `http://localhost:5000`

## Building for Production

### Backend

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The optimized production build will be in the `frontend/build` directory.

## Troubleshooting

### Port Already in Use

**Backend:**
Edit `backend/server.js` and change the PORT value:
```javascript
const PORT = process.env.PORT || 5001; // Change 5000 to 5001
```

**Frontend:**
The React dev server will automatically prompt to use another port.

### Cannot Connect to Backend

1. Ensure the backend server is running on port 5000
2. Check the proxy setting in `frontend/package.json`
3. Look for CORS errors in the browser console

### Database Issues

1. Ensure the `backend` directory has write permissions
2. Delete `tasks.db` to reset the database
3. Check Node.js has permission to create files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available for educational purposes.

## Support

For detailed technical documentation, see [CLAUDE.md](./CLAUDE.md)

## Acknowledgments

Built with:
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [SQLite](https://www.sqlite.org/)
- [Axios](https://axios-http.com/)
