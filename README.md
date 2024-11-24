PGHub - Guest and Payment Management System
Introduction
PGHub is a comprehensive platform designed for managing guest records, room allocations, and payment tracking. 
It features an admin dashboard for monitoring key metrics, ensuring seamless guest management for PG (Paying Guest) facilities.

...........................................Role-Based Access Control (RBAC)...................................................................................................................
This project implements Role-Based Access Control (RBAC) to enhance security and usability by controlling user access based on their assigned roles. 
RBAC ensures that users only access the pages and functionalities relevant to their role, minimizing the risk of unauthorized actions and improving user experience.

RBAC Implementation in This Project
Role-Based Page Access:

Admin Role:
  Access to both Admin Dashboard and Workers Management pages.
  Can view and manage workers and users across the system.
  Has the ability to assign or update roles for users and workers.
Worker Role:
  Limited access to their own workspace or specific pages assigned by the admin.
  Cannot view or modify other workers or users' roles.
Role Assignment and Management:

  Admin users can dynamically assign roles to workers and users through a user-friendly interface.
  Roles determine the permissions and access levels for each user.
  Example: A user assigned the "Worker" role can only access the pages and actions specified for workers.
  Dynamic Role Handling:

  Admins can update user roles at any time to adjust permissions as needed.
  Roles can include specific permissions such as "View Workers," "Update Salaries," or "Terminate Users."
Secure Workflow:

  Unauthorized access attempts are blocked based on role validation.
  Each user action is validated against their assigned permissions, ensuring a secure and controlled environment.


___________________Features_________________________-________________________________________________________________________________
Guest Management
  Add, update, and delete guest records with ease.
  Assign and manage room allocations for each guest.
  Maintain detailed guest profiles, including personal information,profile and adhaar images and room preferences.
Payment Tracking
  Track monthly payments with overdue alerts.
  Maintain a payment history for each guest, including dates and amounts.
  Update payments dynamically, including partial or full payments.
Admin Dashboard
  View real-time metrics such as guest count, room availability, and financial summaries.
  Access user-friendly cards displaying essential details of each guest, including room status and payment history.
  Integrated features to update roles, salaries, and manage room assignments.
Technology Stack
  Frontend
    React.js: Built the dynamic and responsive user interface.
    CSS Framework: Tailwind CSS for styling.
  Backend
    Node.js with Express.js: Developed RESTful APIs for managing guest and payment data.
    Database: MongoDB for storing guest profiles, payment records, and room details.
    AWS(S3) : FOR storing images


PGHub/
│
├── src/
│   ├── components/
│   │   ├── GuestModels.jsx        // Displays individual guest details
│   │   ├── AdminComponents.jsx        // Main admin dashboard
│   │   └── Loder.js,Login.jsx   
│   │
│   ├── pages/
│   │   ├── Home.js             // Homepage with key metrics
|   |   |__AddGuest.jsx
│   │   └── GuestList.js     // Page to add, edit, and delete guests
|   |   |__Admin.jsx
│   │
│   ├── context/
│   │   └── StoreContext.js     // Context API for global state management
│   │
│   ├── utils/
│   │   └── api.js              // Contains API call functions
│   │
│   └── App.js                  // Main React application
│
├── server/
│   ├── models/
│   │   └── Guest.js            // Guest schema for MongoDB
│   │
│   ├── routes/
│   │   ├── guests.js           // Routes for guest management
│   │   └── payments.js         // Routes for payment management
│   │
│   └── app.js                  // Express server setup
│
└── README.md                   // Project documentation



********************************* How to Run the Project ********************************>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Prerequisites
  Node.js installed
  MongoDB database set up
  A modern web browser

-->  Setup Instructions
      Clone the repository:


  Copy code
    git clone https://github.com/your-repo/PGHub.git
      cd PGHub
Install dependencies:

For frontend:

  cd frontend
  npm install
For backend:

  cd backend
  npm install
  Set up environment variables:

Create a .env file in the server directory with the following variables:
JWT_SECRET="nikhilreddy"


//mongodb 

MONGODB_CONNECTION=""


//email for sending otps for forgotpasswordes

EMAIL=""
PASSWORD=""




AWS_ID=""
AWS_SECRET=""
AWS_BUCKET_NAME=""




Run the application:

Start the backend:

npm start
Start the frontend:

npm start
Access the application: Open your browser and navigate 

_____________________________Key APIs________________________________
Guest Management
  GET /api/guests - Fetch all guest details.
  POST /api/guests - Add a new guest.
  PUT /api/guests/:id - Update guest information.
  DELETE /api/guests/:id - Remove a guest.
Payment Management
  GET /api/payments/:guestId - Fetch payment history for a guest.
  POST /api/payments - Add a payment record.
  PUT /api/payments/:id - Update a payment record.
Future Enhancements
  Add support for multiple PG facilities.
  Implement guest feedback and review features.
  Include analytics and reporting for better business insights.
Contributors
BADDAM NIKHIL KUMAR REDDY - Fullstack Developer



