# Event Registration System

A backend API for managing events and user registrations. Users can sign up, log in, create events, view event lists, join events, and delete their accounts. Built with Node.js, Express, MongoDB, and JWT for authentication.

## Features
- **User Authentication**: Sign up, log in, and delete account with JWT-based authentication.
- **Event Management**: Create events, view all events, join/leave events with capacity limits.
- **Secure**: Password hashing with bcryptjs, protected routes with JWT.
- **Database**: MongoDB for storing users and events.

## Tech Stack
- **Node.js**: Backend runtime.
- **Express.js**: API framework.
- **MongoDB**: Database (Mongoose ODM).
- **JWT**: Token-based authentication.
- **bcryptjs**: Password hashing.

## Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Postman (for testing APIs)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ShafiqueNaveed/event-registration-system.git
   cd event-registration-system

## 2. Install Dependencies:

npm install

## 3. Set Up Environment Variables:

Create a .env file in the root directory.
Add:
JWT_SECRET=your-secret-key-here
MONGO_URI=your_mongo_connection_string
PORT=3000 

## 4. Run MongoDB:

Ensure MongoDB is running locally (port 27017) or use MongoDB Atlas URI in app.js.

## 5. Start the Server:

node app.js

Server runs on http://localhost:3000.

### API Endpoints

| Method | Endpoint                | Description                     | Headers                     | Body Example                                  |
|--------|-------------------------|---------------------------------|-----------------------------|-----------------------------------------------|
| POST   | `/auth/signup`         | Register a new user            | None                        | `{ "name": "Ali", "email": "ali@example.com", "password": "pass123" }` |
| POST   | `/auth/login`          | Log in user (returns token)    | None                        | `{ "email": "ali@example.com", "password": "pass123" }` |
| DELETE | `/auth/delete`         | Delete own account             | Authorization: Bearer <token>| None                                          |
| GET    | `/events`              | List all events                | Authorization: Bearer <token>| None                                          |
| POST   | `/events`              | Create a new event             | Authorization: Bearer <token>| `{ "title": "Party", "description": "Fun event", "date": "2025-12-15", "location": "Lahore", "capacity": 10 }` |
| POST   | `/events/:id/join`     | Join an event                  | Authorization: Bearer <token>| None                                          |
| DELETE | `/events/:id/leave`    | Leave an event                 | Authorization: Bearer <token>| None                                          |


### Testing with Postman

1. Sign Up: POST /auth/signup → Get user in DB.
2. Log In: POST /auth/login → Copy token from response.
3. Use Token: Add Authorization: Bearer <token> in headers for protected routes.
4. Test Flow: Create event → Join event → Leave event → Delete account.


### Folder Structure

event-registration-system/
├── app.js              # Main server file
├── authMiddleware.js   # JWT middleware
├── models/
│   ├── User.js        # User schema
│   └── Event.js       # Event schema
├── routes/
│   ├── authRoutes.js  # Auth-related routes
│   └── eventRoutes.js # Event-related routes
├── .env               # Environment variables
├── package.json       # Dependencies
└── README.md          # This file

### Notes

Environment: Replace JWT_SECRET with a strong key in production.
Database: Local MongoDB or Atlas URI supported.
Future Improvements: Add refresh tokens, rate limiting, or frontend (React).

### Contributing

Feel free to fork, submit PRs, or raise issues for bugs/improvements.

### License

MIT License
