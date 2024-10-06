# Coding Marathon 3  

- **Group #:**  Group 3  
- Link to the backend:   
  - [Code for API V1 (without authentication)](https://github.com/JY1Z/collaborative-project-3/tree/BE-API-noAuth/backend)  
  - [Code for API V2 (with authentication)](https://github.com/JY1Z/collaborative-project-3/tree/BE-API-Auth/backend)    
- Link to the frontend:    
  - [Code for the final frontend](https://github.com/JY1Z/collaborative-project-3/tree/main/frontend)    
- URLs for the deployed APIs:  
  - URL for API V1: [API for V1 deployed on Render](https://test-cm3-11.onrender.com/)  
  - URL for API V2: [API for V2 deployed on Render](https://collaborative-project-3-ft0l.onrender.com)  

---

## Self-Assessment of Code

### Frontend

```js
// src/components/JobListings.jsx

// My code
import { Link } from "react-router-dom";

const JobListings = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (

        <div className="job-preview" key={job.id}>
          <Link to={`/jobs/${job.id}`}>
            <h2>{job.title}</h2>
          </Link>
          <p>Type: {job.type}</p>
          <p>Company: {job.company.name}</p>
        </div>
      ))}
    </div>
  );
};

export default JobListings;

// From ChatGPT
import { Link } from "react-router-dom";

const JobListings = ({ jobs }) => {
  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div className="job-preview" key={job.id}>
            <Link to={`/jobs/${job.id}`}>
              <h2>{job.title}</h2>
            </Link>
            <p>Type: {job.type}</p>
            <p>Company: {job.company?.name || 'Unknown Company'}</p>
          </div>
        ))
      ) : (
        <p>No job listings available</p>
      )}
    </div>
  );
};

export default JobListings;
```
**Disscusion:** The code is functional and clean. Key improvements include adding conditional rendering to handle no jobs, using optional chaining to prevent crashes if company data is missing, and providing a fallback message. Overall, it's well-structured but can benefit from enhanced error handling.

```js
// File name or function
// Your code part B
```

### Backend

```js
// middleware\requireAuth.js

// My code
//const jwt = require("jsonwebtoken");
//const User = require("../models/userModel");
//
//const requireAuth = async (req, res, next) => {
//  // verify user is authenticated
//  const { authorization } = req.headers;
//
//  if (!authorization) {
//    return res.status(401).json({ error: "Authorization token required" });
//  }
//
//  const token = authorization.split(" ")[1];
//
//  try {
//    const { _id } = jwt.verify(token, process.env.SECRET);
//
//    req.user = await User.findOne({ _id }).select("_id name username phone_number gender date_of_birth membership_status address profile_picture");
//    next();
//  } catch (error) {
//    console.log(error);
//    res.status(401).json({ error: "Request is not authorized" });
//  }
//};
//
//module.exports = { requireAuth };

// From ChatGPT
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    // Verify the token
    const { _id } = verifyToken(token);

    // Fetch the user from the database
    const user = await User.findOne({ _id }).select(
      "_id name username phone_number gender date_of_birth membership_status address profile_picture"
    );

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    handleTokenErrors(error, res, next);
  }
};

// Helper function to verify the JWT token
const verifyToken = (token) => {
  if (!process.env.SECRET) {
    throw new Error("JWT secret is missing in environment variables");
  }

  return jwt.verify(token, process.env.SECRET);
};

// Error handling function for token-related errors
const handleTokenErrors = (error, res, next) => {
  console.error("Authentication error:", error.message);

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token has expired" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  } else {
    // For any other errors, propagate them to the global error handler
    next(error);
  }
};

module.exports = { requireAuth };

```
**Disscusion:** Code from ChatGPT is better structured, and scalable due to improved error handling, better separation of concerns, and more informative feedback to the client.


```js
// File name or function
// Your code part B
```
