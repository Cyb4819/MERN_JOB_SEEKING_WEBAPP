# MERN Job Seeking WebApp

This project is a full-stack job portal application with:

- **Frontend:** React (Vite)
- **Backend:** Node.js (Express, MongoDB)

## Objective

The goal of this project is to provide a modern, user-friendly platform for job seekers and employers. Users can search and apply for jobs, while employers can post and manage job listings. The application focuses on a seamless experience, robust authentication, and efficient job management.

## Key Features

- User authentication and registration (job seekers & employers)
- Post, edit, and delete job listings (employers)
- Search and filter jobs by category, location, and more
- Apply to jobs and manage applications (job seekers)
- Responsive, modern UI with clear navigation
- Secure backend with JWT-based authentication
- Resume upload and application tracking

## Tools & Technologies Used

- **Frontend:** React, Vite, CSS Modules
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** React Context API
- **Custom Chatbot:** Botpress Studio
- **Other:** Multer (for file uploads), dotenv, and more

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Environment Variables

- Copy `backend/config/config.env.example` to `backend/config/config.env` and fill in your MongoDB URI and JWT secret.

### Database

- Make sure MongoDB is running locally or provide a remote connection string in your `.env` file.

## Further instructions for feature and UI integration will be added as the project develops.
