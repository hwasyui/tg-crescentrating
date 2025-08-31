# Task Management API

A simple REST API for managing tasks, built with Node.js, Express, and MongoDB. This was created as part of a technical assessment for Crescent Rating.

## What it does

This API lets you manage tasks with full CRUD operations. You can create tasks, filter them by different criteria, sort them however you want, and get some basic statistics about your task collection.

## Task Structure

Each task has these fields:
```javascript
{
  title: String (required, 1-200 characters)
  description: String (optional, up to 1000 characters)
  category: One of [Work, Personal, Shopping, Health, Education, Other]
  priority: One of [Low, Medium, High]
  deadline: Date (optional)
  completed: Boolean (defaults to false)
  createdAt: Date (set automatically)
  updatedAt: Date (updated automatically)
}
```

## Getting Started

### What you'll need
- Node.js (version 14 or newer)
- MongoDB (either local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Get the code**
```bash
git clone https://github.com/hwasyui/tg-crescentrating
cd tg-crescentrating
```

2. **Install packages**
```bash
npm install
```

3. **Set up environment**
Create a `.env` file:
```env
PORT=3000
MONGODB_URI="<your mongodb connection string>"
```

4. **Make sure MongoDB is running**
```bash
# If you're using local MongoDB
mongod

# If using MongoDB Atlas, just make sure your IP is whitelisted
```

5. **Start the server**
```bash
npm run start
```

6. **Test it's working**
- API endpoints: `http://localhost:3000/tasks`
- Documentation: `http://localhost:3000/api-docs`

## How I organized the code

```
├── controllers/        # Handles HTTP requests and responses
├── models/            # MongoDB schemas and data models
├── routes/            # API endpoints and Swagger documentation
├── services/          # Business logic and database operations
├── validators/        # Input validation rules
├── middleware/        # Error handling and other middleware
├── config/            # App configuration (Swagger setup)
├── app.js            # Express app setup
├── index.js          # Database connection and server startup
└── README.md
```

## Why I built it this way

### MVC + Service Layer
I separated concerns into different layers:
- **Controllers** handle the HTTP stuff and pass data around
- **Services** contain the actual business logic and talk to the database
- **Models** define what a task looks like and validation rules
- **Routes** just define the endpoints and documentation

This makes it easier to test individual pieces and modify things later without breaking everything else.

### MongoDB
I chose MongoDB because:
- It's flexible - if we need to add new task properties later, it's easy
- Works great with JavaScript/JSON
- Good performance for the kind of filtering and sorting this API needs
- I'm familiar with it

### Validation approach
I validate input at the route level before it gets to the controller. This catches bad data early and gives clear error messages back to whoever is using the API.

### Error handling
All errors go through a central middleware that formats them consistently. No matter what goes wrong, you'll get a predictable JSON response with the right HTTP status code.

## Available endpoints

| Method | URL | What it does |
|--------|-----|--------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | Get all tasks (with optional filtering/sorting) |
| GET | `/tasks/stats` | Get statistics about your tasks |
| GET | `/tasks/:id` | Get one specific task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Using the API

### Creating a task
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finish the API documentation",
    "description": "Write clear docs so people can actually use this thing",
    "category": "Work",
    "priority": "High",
    "deadline": "2024-12-31T23:59:59.000Z"
  }'
```

### Getting tasks with filters
```bash
# Show me all high priority work tasks that aren't done yet
curl "http://localhost:3000/tasks?category=Work&priority=High&completed=false"

# Tasks due this month
curl "http://localhost:3000/tasks?deadlineFrom=2025-08-01&deadlineTo=2025-08-31"
```

### Updating a task
```bash
curl -X PUT http://localhost:3000/tasks/68b4430ad02cc46cde0f4d15 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Available query parameters

When getting tasks, you can use these filters:

| Parameter | Type | What it does | Example |
|-----------|------|--------------|---------|
| `category` | string | Filter by category | `Work`, `Personal`, etc. |
| `priority` | string | Filter by priority | `Low`, `Medium`, `High` |
| `completed` | boolean | Show completed or pending tasks | `true`, `false` |
| `deadlineFrom` | date | Tasks due after this date | `2024-09-01` |
| `deadlineTo` | date | Tasks due before this date | `2024-12-31` |
| `sortBy` | string | What to sort by | `createdAt`, `deadline`, `priority`, `title` |
| `sortOrder` | string | Sort direction | `asc`, `desc` |

## Documentation

### Swagger UI
Go to `http://localhost:3000/api-docs` for interactive documentation. You can try out all the endpoints directly from your browser.

### Postman Collection
I've included a Postman collection with:
- All the endpoints set up and ready to use
- Sample requests with different scenarios
- Automatic tests to verify responses
- Sample data creation scripts

Import `config/task-api.postman.json` into Postman to get started quickly.


## Deployment attempts

I tried to deploy this to a few platforms but ran into payment issues:

- **Render**: My card got declined when trying to set up the deployment
- **Railway**: Same issue with the payment method

For now, it only runs locally. If you want to deploy it somewhere, these platforms should work fine once the payment stuff is sorted out.

## What could be improved

If I had more time, here's what I'd add:
- User authentication (right now anyone can access everything)
- Pagination for when you have lots of tasks
- Better error messages
- Task categories that users can customize
- Due date reminders
- Task templates for recurring work
- Search functionality
- File attachments

That's pretty much it! Thank you. I hope you can choose me as a new intern :D!
