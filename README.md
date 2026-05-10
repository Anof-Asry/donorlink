# DonorLink – Blood Donor Management System

## Problem Description
Every year, thousands of lives are lost due to the unavailability of blood at the right time. Hospitals and blood banks struggle to maintain updated donor records, match compatible donors with patients in need, and manage urgent blood requests efficiently. The lack of a centralized digital system makes this process slow and unreliable.

## Proposed Solution
DonorLink is a RESTful API-based web system that digitally manages blood donors, patients, and blood requests. It allows hospitals and blood banks to register donors, track blood group availability, match donors to recipients, and manage urgent requests through a structured backend and React frontend.

## Features
-  Register and manage blood donors
-  Track patients requiring blood transfusions
-  Create and manage urgent blood requests
-  Auto match available donor by blood group
-  Auto restore donor availability when request is deleted
-  Filter donors by blood group
-  Full CRUD operations for all collections
-  React frontend with clean UI

## Technologies Used
| Technology | Purpose |
|------------|---------|
| Node.js    | Backend runtime |
| Express.js | REST API framework |
| MongoDB    | Database |
| Mongoose   | MongoDB ODM |
| React.js   | Frontend UI |
| Vite       | Frontend build tool |
| Axios      | HTTP client |
| React Router | Frontend routing |
| Postman    | API testing |
| Git & GitHub | Version control |

## API Endpoints

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/donors | Get all donors |
| POST | /api/donors | Create new donor |
| GET | /api/donors/:id | Get donor by ID |
| PUT | /api/donors/:id | Update donor |
| DELETE | /api/donors/:id | Delete donor |
| GET | /api/donors/bloodgroup/:bloodGroup | Get donors by blood group |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patients | Get all patients |
| POST | /api/patients | Create new patient |
| GET | /api/patients/:id | Get patient by ID |
| PUT | /api/patients/:id | Update patient |
| DELETE | /api/patients/:id | Delete patient |

### Blood Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/requests | Get all requests |
| POST | /api/requests | Create new request |
| GET | /api/requests/:id | Get request by ID |
| PUT | /api/requests/:id | Update request |
| DELETE | /api/requests/:id | Delete request |
| PUT | /api/requests/:id/match | Auto match donor |

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB installed locally
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/donorlink.git

# Go into project folder
cd donorlink

# Install dependencies
npm install

# Create .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/donorlink

# Start backend
npm run dev

# Go into frontend folder
cd frontend  

# Install dependencies
npm install

# Start frontend
npm run dev


## How to Run
> Start MongoDB locally
> Run backend → npm run dev (runs on port 5000)
> Run frontend → cd frontend && npm run dev (runs on port 5173)
> Open browser → http://localhost:5173

## API Testing
> Import donorlink-postman.json into Postman
> All endpoints are tested and documented
