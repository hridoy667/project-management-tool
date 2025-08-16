Taskly - Frontend

This is the React frontend for Taskly, a web-based task and project management tool.

Features

React frontend with functional components and hooks.
Axios used for API integration with credentials and JWT handling.
Responsive UI built with Bootstrap.
Real-time search for tasks by title.
Dynamic fetching of objectives, dependencies, and task data.
Users can update task status and post comments.

Setup Instructions

Install dependencies:
npm install

Update Axios baseURL to point to your deployed backend URL (e.g., Render):
const instance = axios.create({
  baseURL: 'https://your-render-backend-url/api/v1',
  withCredentials: true,
});

Start the frontend:
npm start


Frontend runs at http://localhost:3001

Deployment
Deployed on Netlify
runs at https://taskly24.netlify.app/

Ensure Axios baseURL points to the Render backend URL.
Environment variables can be configured in Netlify if needed.

Usage

Register as a User. Admin can promote a user to Manager.
Admin can create tasks, assign users, and define objectives & dependencies.
Users can view assigned tasks, update status, and post comments.
Managers can create objectives and stay connected through commenting.
Circular dependencies are prevented.
