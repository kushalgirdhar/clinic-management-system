# Clinic Management System

A full-stack Clinic Management System built using React, FastAPI, MySQL, and Docker. The system helps clinics efficiently manage patients, doctors, appointments, and user authentication through a modern web interface and RESTful APIs.

---

## Features

* User Authentication and Authorization
* Patient Registration and Management
* Doctor Management
* Appointment Scheduling and Tracking
* Real-time Communication using WebSockets
* RESTful API Architecture
* MySQL Database Integration
* Dockerized Multi-Container Deployment
* Interactive API Documentation with Swagger UI

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Bootstrap

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn
* Python-Jose (JWT Authentication)
* Passlib (Password Hashing)

### Database

* MySQL 8.0

### DevOps & Deployment

* Docker
* Docker Compose

---

## Project Structure

```text
clinic-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── websockets/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Installation & Setup

### Prerequisites

* Docker Desktop
* Git

### Clone Repository

```bash
git clone <repository-url>
cd clinic-management-system
```

### Create Environment File

Create a `.env` file in the project root.

```env
DB_HOST=db
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clinic_db

SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Run Application

```bash
docker compose up --build
```

To run in background:

```bash
docker compose up -d
```

---

## Access Application

### Frontend

```text
http://localhost:3000
```

### Backend API

```text
http://localhost:8000
```

### Swagger Documentation

```text
http://localhost:8000/docs
```

---

## Docker Architecture

```text
React Frontend
       │
       ▼
FastAPI Backend
       │
       ▼
MySQL Database
```

The application is fully containerized using Docker Compose, enabling one-command deployment and consistent execution across environments.

---

## Database Models

* Users
* Patients
* Doctors
* Appointments

Tables are automatically created using SQLAlchemy ORM during application startup.

---

## API Modules

### Authentication

* Login
* JWT Token Generation
* Authorization

### Patients

* Create Patient
* View Patients
* Update Patient
* Delete Patient

### Doctors

* Create Doctor
* View Doctors
* Update Doctor
* Delete Doctor

### Appointments

* Schedule Appointment
* Update Appointment
* Cancel Appointment
* View Appointment History

---

## Future Enhancements

* Email Notifications
* Prescription Management
* Medical Reports Upload
* Dashboard Analytics
* Role-Based Access Control
* Cloud Deployment on AWS

---

## Contributor

**Kushal Girdhar**

MCA (Artificial Intelligence & Data Science)

Vivekananda Global University, Jaipur

```
```
