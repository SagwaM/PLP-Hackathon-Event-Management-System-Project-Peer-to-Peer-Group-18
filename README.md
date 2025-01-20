# 🔗Event Management System
A modern, interactive, and user-friendly Event Management System designed to streamline event planning and attendee management. This full-stack project combines an elegant frontend interface with a robust Node.js backend and MySQL database for seamless operations.
# 🚀Features
## Core Functionality
- Event Creation: Add new events with titles, descriptions, and dates.
- Event Management: View, update, and delete events with ease.
- Event Categories: Organize events using categories for better accessibility.
- User Roles:
- Admin: Manage events, attendees, categories, and view detailed reports.
- Attendee: Browse events, book tickets, and manage bookings.
- Bookings: Attendees can book events, view their bookings, and review past events.
- User Profile: Manage personal information and settings.
## Advanced Features
* Date Validation: Prevent past-date event creation.
* Responsive Design: Fully functional across devices with a mobile-first approach.
* Interactive Animations: Smooth transitions and modern UI components.
* Reports and Analytics: Insights into event performance and attendee activity.
# Project Structure
## Frontend Files
HTML Pages:
- categories.html: Manage event categories.
- add-event.html: Form to create new events.
- admin-1.html / admin.html: Admin dashboards for managing events, categories, and users.
- attendee-1.html / attendee.html: Attendee dashboard to access bookings and events.
- attendee-booking.html: Booking interface for attendees.
- attendee-events.html: Browse and explore available events.
- index.html: Landing page showcasing key features of the system.
- login.html: Secure login page for users.
- my-bookings.html: Attendee's personalized bookings page.
- profile.html: User profile management.
- recently-attended.html: View past attended events.
- register.html: User registration page.
- reports-analytics.html: Admin insights into event analytics.
- settings.html: User account settings.
- view-bookings.html: Admin interface to monitor attendee bookings.
- view-categories.html: Admin interface to manage categories.
- view-events.html: Admin and attendee views for all events.
## Backend
- Node.js and Express.js:
- RESTful APIs for CRUD operations (Create, Read, Update, Delete).
- Secure authentication and role-based access control.
- Integration with MySQL for efficient data management.
## MySQL Database:
- Tables for users, events, bookings, and categories.
- Optimized queries for performance and scalability.
# Getting Started
Follow these steps to set up the project locally:

## Prerequisites
- Node.js (v16 or higher)
- MySQL
- Any modern browser (for testing the frontend)
## Installation
Clone the Repository:
`git clone https://github.com/your-username/event-management-system.git`
`cd event-management-system`
- Install Dependencies:
`npm install`
- Database Setup:
- database
  ```
  const dbConfig = {
  host: 'localhost',
  user: 'your-username',
  password: 'your-password',
  database: 'event_management',
};

module.exports = dbConfig;
Start the Server:

bash
Copy
Edit
npm start
Access the Application:

Open your browser and navigate to http://localhost:3000.

