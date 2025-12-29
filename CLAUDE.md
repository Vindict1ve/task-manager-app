# Task Manager Application - Technical Documentation

## Project Overview

A full-stack task management application built with Node.js/Express backend and React frontend, using SQLite for data persistence.

## Architecture

### Backend (Node.js/Express)

**Location:** `backend/`

**Key Components:**
- `server.js` - Main Express server setup
- `database.js` - SQLite database configuration and schema
- `routes/tasks.js` - RESTful API endpoints for task operations

**Dependencies:**
- `express` - Web framework
- `sqlite3` - SQLite database driver
- `cors` - Cross-Origin Resource Sharing middleware
- `body-parser` - Request body parsing middleware

**Database Schema:**
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Frontend (React)

**Location:** `frontend/`

**Key Components:**
- `src/App.js` - Main application component with state management
- `src/components/TaskForm.js` - Form for creating/editing tasks
- `src/components/TaskList.js` - Container for displaying tasks
- `src/components/TaskItem.js` - Individual task display component

**Dependencies:**
- `react` - UI library
- `react-dom` - React DOM rendering
- `axios` - HTTP client for API requests
- `react-scripts` - Build tooling

## API Endpoints

### Base URL: `http://localhost:5000/api/tasks`

#### GET /api/tasks
Retrieve all tasks
- **Response:** `{ tasks: Task[] }`

#### GET /api/tasks/:id
Retrieve a specific task by ID
- **Response:** `{ task: Task }`
- **Error 404:** Task not found

#### POST /api/tasks
Create a new task
- **Request Body:**
  ```json
  {
    "title": "string (required)",
    "description": "string (optional)",
    "status": "pending | completed (optional, default: pending)"
  }
  ```
- **Response:** `{ task: Task }`
- **Error 400:** Title is required

#### PUT /api/tasks/:id
Update an existing task
- **Request Body:**
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "status": "pending | completed (optional)"
  }
  ```
- **Response:** `{ task: Task }`
- **Error 404:** Task not found
- **Error 400:** Invalid status or no fields to update

#### DELETE /api/tasks/:id
Delete a task
- **Response:** `{ message: "Task deleted successfully" }`
- **Error 404:** Task not found

## Task Model

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}
```

## Features

### Backend Features
- RESTful API design
- SQLite database with automatic schema creation
- CORS enabled for cross-origin requests
- Input validation
- Automatic timestamp management (createdAt, updatedAt)
- Error handling middleware

### Frontend Features
- Create new tasks
- Edit existing tasks
- Delete tasks
- Toggle task status (pending/completed)
- View all tasks with filtering by status
- Real-time UI updates
- Form validation
- Success/error notifications
- Responsive design

## Development Workflow

### Starting the Backend
```bash
cd backend
npm install
npm start      # Production
npm run dev    # Development with nodemon
```
Server runs on: `http://localhost:5000`

### Starting the Frontend
```bash
cd frontend
npm install
npm start
```
Application runs on: `http://localhost:3000`

### API Proxy
The frontend is configured with a proxy to `http://localhost:5000`, allowing API calls to use relative paths like `/api/tasks`.

## File Structure

```
task-manager-app/
├── backend/
│   ├── routes/
│   │   └── tasks.js          # Task CRUD endpoints
│   ├── database.js            # SQLite setup and schema
│   ├── server.js              # Express server
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.js   # Create/edit form
│   │   │   ├── TaskList.js   # Task list container
│   │   │   └── TaskItem.js   # Individual task
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Styles
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── .gitignore
├── CLAUDE.md                  # This file
├── README.md
└── .gitignore
```

## Technical Decisions

### Why SQLite?
- Lightweight and serverless
- No additional setup required
- Perfect for development and small applications
- File-based storage for easy backup

### Why Express?
- Minimalist and flexible
- Large ecosystem
- Easy to understand and maintain
- Excellent middleware support

### Why React?
- Component-based architecture
- Virtual DOM for efficient updates
- Large community and ecosystem
- Hooks for clean state management

## Security Considerations

### Current Implementation
- Input validation on required fields
- SQL injection prevention through parameterized queries
- CORS enabled (should be restricted in production)

### Production Recommendations
1. Add authentication and authorization
2. Implement rate limiting
3. Add request size limits
4. Use environment variables for configuration
5. Add HTTPS
6. Implement proper error logging
7. Add database backups
8. Restrict CORS to specific origins
9. Add input sanitization
10. Implement API versioning

## Future Enhancements

### Potential Features
- User authentication and authorization
- Task categories/tags
- Task priorities
- Due dates and reminders
- Search and filtering
- Sorting options
- Pagination for large task lists
- Task attachments
- Collaborative tasks
- Activity history
- Export/import functionality

### Technical Improvements
- Migrate to PostgreSQL/MySQL for production
- Add API documentation (Swagger/OpenAPI)
- Implement unit and integration tests
- Add CI/CD pipeline
- Containerize with Docker
- Add TypeScript for type safety
- Implement caching
- Add WebSocket for real-time updates
- Optimize database queries
- Add database migrations

## Troubleshooting

### Common Issues

**Port Already in Use:**
- Change PORT in backend/server.js
- Update proxy in frontend/package.json

**CORS Errors:**
- Ensure backend is running
- Check CORS configuration in server.js

**Database Not Creating:**
- Check file permissions
- Ensure backend directory is writable

**Frontend Not Connecting to Backend:**
- Verify proxy setting in frontend/package.json
- Ensure backend is running on port 5000
- Check browser console for errors

## Performance Considerations

### Current Setup
- Suitable for small to medium-scale applications
- SQLite performs well for read-heavy workloads
- Frontend uses React's virtual DOM for efficient updates

### Optimization Tips
1. Add database indexes for frequently queried fields
2. Implement pagination for large datasets
3. Add caching layer (Redis)
4. Use React.memo for expensive components
5. Implement lazy loading for components
6. Optimize bundle size with code splitting
7. Add service worker for offline functionality

## Maintenance

### Regular Tasks
- Update dependencies regularly
- Monitor database size
- Review and clean up unused code
- Update documentation
- Backup database files
- Monitor application logs

### Database Maintenance
- The SQLite database file is created at `backend/tasks.db`
- Backup regularly in production
- Consider migration to PostgreSQL for scale

## Contributing Guidelines

1. Follow existing code style
2. Add comments for complex logic
3. Update documentation for new features
4. Test changes before committing
5. Use meaningful commit messages
6. Keep components small and focused
7. Follow React best practices

## License

This project is provided as-is for educational and development purposes.
