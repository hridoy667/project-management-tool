Taskly - Backend

Taskly is a web-based task and project management tool. This is the backend service, built with Node.js, Express.js, and MongoDB.

Features
Modular backend with separate modules for Users, Tasks, Managers, and Admin.
Role-based access control (Admin, Manager, User).
Task creation, assignment, update, and deletion with objectives and dependencies.
Circular dependency detection with automatic rollback.
User dashboard with status updates and commenting.
Task analytics and visualization support (via frontend).
Performance enhancements: backend rate limiting, caching, and lazy loading.
MongoDB Atlas integration for scalable, relational data handling.

Architecture
Backend: Node.js + Express.js REST API.
Database: MongoDB Atlas, Mongoose ODM.

Modules:
Users – registration, authentication, role management.
Tasks – creation, assignment, dependencies, objectives, comments.
Managers & Admin – role-based access and task oversight.
Circular dependency handling ensures data integrity for task dependencies.

Setup Instructions
Clone the repository:

git clone https://github.com/hridoy667/project-management-tool.git
cd project-management-tool/server


Install dependencies:
npm install


Configure environment variables in .env (MongoDB URI, JWT secret, port, etc.).
Start the backend:
npm start


Backend runs at http://localhost:3000 by default.
Backend deployed live at https://taskly-wiy0.onrender.com/api/v1

API Endpoints

Here is the Postman Collection Link
You must have to login to access :
https://aliimam-9833535.postman.co/workspace/Ali-Imam's-Workspace~51acdf75-4856-49de-8701-0712fac5e316/collection/46572369-fec24004-fa5b-44c5-8b5b-1ae2396cd529?action=share&creator=46572369


Deployment
Backend deployed on Render.
Ensure MongoDB Atlas is connected and environment variables are correctly set.

Scalability
MongoDB Atlas supports horizontal scaling with sharding.
Modular architecture allows adding new features and microservices.
JWT authentication and API rate limiting ensure security.
