# Website Builder AI

## Project Overview

Website Builder AI is a full-stack web application that allows users to generate websites using artificial intelligence. Users can create, customize, and deploy websites through an intuitive interface powered by AI-driven code generation. The platform supports user authentication via Google, credit-based usage tracking, and different subscription plans.

## Features

- **AI-Powered Website Generation**: Generate complete websites based on user prompts
- **User Authentication**: Secure login using Google OAuth
- **Credit System**: Track and manage user credits for website generation
- **Subscription Plans**: Support for free, pro, and enterprise plans
- **Website Management**: View, edit, and deploy generated websites
- **Real-time Conversation**: Maintain conversation history with AI for iterative improvements
- **Responsive Design**: Modern, mobile-friendly user interface

## Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google OAuth** for user login
- **OpenRouter API** for AI integration
- **Cookie Parser** for session management

### Frontend
- **React 19** with Vite build tool
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Firebase** for additional services
- **Axios** for API calls
- **React Toastify** for notifications

## Project Structure

```
websiteBuilderAi/
├── backend/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── openRouter.js      # AI API configuration
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── user.controllers.js    # User management
│   │   └── website.controllers.js # Website generation
│   ├── middleware/
│   │   └── isAuth.js              # Authentication middleware
│   ├── models/
│   │   ├── user.model.js          # User schema
│   │   └── website.model.js       # Website schema
│   ├── routes/
│   │   ├── auth.routes.js         # Auth endpoints
│   │   ├── user.routes.js         # User endpoints
│   │   └── website.routes.js      # Website endpoints
│   ├── utils/
│   │   └── extractJson.js         # JSON extraction utilities
│   ├── index.js                   # Main server file
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── LoginModel.jsx     # Login modal component
│   │   ├── hooks/
│   │   │   └── userGetCurrentUser.jsx # Custom hook for user data
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # User dashboard
│   │   │   ├── Generate.jsx       # Website generation page
│   │   │   └── Home.jsx           # Landing page
│   │   ├── redux/
│   │   │   ├── store.js           # Redux store
│   │   │   └── userSlice.js       # User state slice
│   │   ├── App.css
│   │   ├── App.jsx                # Main app component
│   │   ├── firebase.js            # Firebase configuration
│   │   ├── index.css
│   │   └── main.jsx               # App entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
└── README.md
```

## Backend Models

### User Model
```javascript
{
  name: String (required),
  email: String (unique, required),
  avatar: String,
  credits: Number (default: 100, min: 0),
  plan: String (enum: ["free", "pro", "enterprise"], default: "free")
}
```

### Website Model
```javascript
{
  user: ObjectId (ref: 'User', required),
  title: String (default: 'My Website'),
  latestCode: String (required),
  conversation: [{
    role: String (enum: ['user', 'ai'], required),
    content: String (required)
  }],
  deployed: Boolean (default: false),
  deployUrl: String,
  slug: String (unique, required)
}
```

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication Routes (`/api/auth`)
- `POST /google` - Authenticate user via Google OAuth
- `GET /logout` - Logout user

### User Routes (`/api/user`)
- `GET /me` - Get current authenticated user information (requires authentication)

### Website Routes (`/api/website`)
- `POST /generate` - Generate a new website based on user prompt (requires authentication)

## Frontend Structure

The frontend is built with React and organized into the following key components:

- **Pages**: Home (landing), Dashboard (user panel), Generate (AI website creation)
- **Components**: Reusable UI components like LoginModal
- **Hooks**: Custom hooks for data fetching (e.g., userGetCurrentUser)
- **Redux**: State management for user data and application state
- **Routing**: Client-side routing with React Router

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Google OAuth credentials
- OpenRouter API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with Firebase configuration if needed.

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:8000`.

## Usage

1. **Registration/Login**: Users can sign in using Google OAuth from the home page.

2. **Dashboard**: After login, users can view their profile, credits, and existing websites.

3. **Website Generation**: On the generate page, users can input prompts to create websites using AI.

4. **Credit Management**: Each website generation consumes credits based on the plan.

5. **Deployment**: Generated websites can be deployed and accessed via unique URLs.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.