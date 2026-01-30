LegacyApp – Task Manager (Legacy)

This repository contains a task management application developed with Node.js, Express, and MongoDB on the backend, and a static frontend built with HTML, CSS, JavaScript, and Bootstrap.

This project was assigned by my university professor as part of a course on Software Architecture and System Design.

The project represents a legacy-style system that was improved to enhance usability, structure, and maintainability.

Project Description

LegacyApp is a simple task manager that allows users to manage tasks and projects. It supports task creation, editing, deletion, comments, search filters, and basic reports.

This project was developed as a university assignment focused on analyzing, migrating, and improving a legacy application using modern development practices.

The main objective is to demonstrate technical skills in backend, frontend, deployment, and architectural decision-making.

Main Features

Create, read, update, and delete tasks.

Manage projects.

Assign tasks to a default administrator user.

Add and view comments.

Search tasks by status, priority, project, and text.

Generate basic task, project, and user reports.

Display reports and comments in a structured interface.

Technology Stack

Frontend

    HTML5

    CSS3

    JavaScript (Vanilla)

    Bootstrap 5

Backend

    Node.js

    Express

    Mongoose

    Database

    MongoDB

Development Tools

    Nodemon

    Dotenv

Installation and Setup

Install dependencies:

    npm install


Create a .env file in the project root:

    MONGO_URI=mongodb://localhost:27017/database-name
    PORT=7369


Start the application:

    npm run dev
 
    npm start


Open in your browser:

    http://localhost:7369

Project Structure

Main files and folders:

    app.js – Express configuration and middleware.

    server.js – Server initialization and database connection.

    config/db.js – MongoDB connection.

    routes/ – API routes.

    controllers/ – Business logic.

    models/ – Database models.

    frontend/ – User interface files.

Main API Endpoints
Tasks

    GET /api/tasks

    POST /api/tasks

    PUT /api/tasks/:id

    DELETE /api/tasks/:id

    GET /api/tasks/search

Projects

    GET /api/projects

    POST /api/projects

Comments

    GET /api/comments/:taskId

    POST /api/comments

Reports

    GET /api/reports/tasks

    GET /api/reports/projects

    GET /api/reports/users

Data Models

The main data models are:

    Task

    Project

    User

    Comment

Each model includes fields for identifiers, text, dates, and references to other entities.

Task status and priority values are defined in English (for example: Pending, In Progress, Completed, Low, Medium, High).

Architecture
MVC Pattern

The application follows the Model-View-Controller architecture:

    Models manage data.

    Controllers process business logic.

    Views display information to users.

    Monolithic Structure

The system is deployed as a monolithic application where backend and frontend run on the same server.

This simplifies deployment and maintenance.

Serverless Compatibility

With minor changes, the application can be adapted for serverless environments.

Migration Process

The migration and improvement process followed these steps:

    Analyze frontend requirements.

    Update models, routes, and controllers.

    Connect frontend to the API.

    Improve user interface and styling.

    This process ensured data consistency and system stability.

    Testing the Application

To test basic functions:

    Start the server.

    Open the application in a browser.

    CRUD movements projects and tasks.

    CRUD movements comments.

    Use search filters.

    Generate reports.

All main features can be tested through the interface.

Deployment

This application is deployed using Render, a cloud platform for hosting web services.

Render was selected because it offers simple configuration, automatic deployment from GitHub, and built-in HTTPS support.

Deployment Process

The GitHub repository was connected to Render.

A Web Service was created with a Node.js environment.

The build command was set to npm install and the start command to npm start.

Environment variables were configured in the Render dashboard.

The application was deployed automatically after each update.

Environment and Cost

The database connection is managed through the MONGO_URI environment variable.

The PORT variable is assigned automatically by Render.

The application runs on a low-cost plan, keeping monthly expenses below $50 USD.

Limitations

Authentication is basic and not secure.

User roles are not implemented.

Automated tests are not included.

Some features depend on the default administrator account.

These limitations should be addressed in future versions.