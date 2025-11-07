Candidate Information &amp; Video Submission Portal

#  Candidate Portal - Full Stack Project

A full-stack web application built to collect candidate information, resumes, and recorded video introductions as part of a job application process.

---

##  **Overview**

The **Candidate Portal** allows applicants to:
1. Fill in their personal and professional details.
2. Upload their resume (PDF format).
3. Record a short video introduction (max 90 seconds).
4. Review all their information before submission.
5. Submit the final application to be stored in MongoDB (with video in GridFS).

This project simulates a real-world recruitment workflow where candidate data is collected and reviewed by HR/admin teams.

---

##  **Features**

 Candidate information form with validation  
 PDF resume upload (max 5 MB)  
 In-browser video recording (max 90 seconds)  
 Review page before submission  
 MongoDB integration (video stored in GridFS)  
 Responsive, clean UI using Bootstrap  
 Persistent state management with `localStorage`  
 Backend validation and structured API  

---

##  **Tech Stack**

**Frontend:**
- React.js (Vite)
- React Router DOM
- Bootstrap 5

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer & GridFS for video storage
- dotenv, cors

---

##  **Setup Instructions**

### 1️ **Clone the Repository**

```bash
git clone https://github.com/YOUR-USERNAME/candidate-portal.git
cd candidate-portal

### 2 **Install Dependencies**
Backend:

cd backend
npm install

Frontend:

cd ../frontend
npm install

### 3 **Setup Environment Variables**
Create a .env file inside your backend folder:

MONGO_URI=your_mongodb_connection_string
PORT=5000

### 4 **Run the Backend Server**
cd backend
npm start/node server.js

### 5 **Run the Frontend Application**
cd ../frontend
npm run dev


Conclusion
This project demonstrates a complete end-to-end workflow of a modern recruitment portal using the MERN stack — including frontend interaction, backend API handling, and media storage with GridFS.

