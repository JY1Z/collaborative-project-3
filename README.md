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
// src/context/AuthContextProvider.jsx
import { useState } from "react"
import { AuthContext } from "./AuthContext"

const AuthContextProvider = ({ children }) => {
    // Santtu's version
    const user = localStorage.getItem("user")
    const bool = user ? true : false
    const [isAuthenticated, setIsAuthenticated] = useState(bool);

    // Copilot's suggestion: Clearer variable names
    const storedUser = localStorage.getItem("user");
    const initialAuthState = storedUser ? true : false;
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);

    const logout = () => {
        setIsAuthenticated(false)
        localStorage.removeItem("user")
        // Copilot also suggests that I add more here, for ex. redirecting the user
        // However, that exact thing is currently handled in the button click event in the actual component
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

```
**Discussion:** While Copilot can be very useful for providing quick routine codes, it obviously doesn't know the entire context of the application from a human user perspective. I do agree with Copilot's assessment on using clearer variable names, it is a bad habit of mine and its variable name suggestions make the code clearly more readable for other people. 

It is worth noting that Copilot suggested adding Error Handling, but was unable to say where it would be needed. This is a pretty good example of how AI often provides redundant filler text. It is whatever when it comes to coding, since any code changes should be reviewed by a human anyway, however it makes AI text very frustrating to read and easily recognisable as AI.

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
// tests/job.v1.test.js
// My code:
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");

const jobs = [
  {
    title: "Senior React Developer",
    type: "Full-Time",
    description: "We are seeking a talented Front-End Developer to join our team in Boston, MA.",
    company: {
      name: "NewTek Solutions",
      contactEmail: "contact@teksolutions.com",
      contactPhone: "555-555-5555"
    },
    location: "Helsinki",
    salary:"20",
    postedDate: "01-09-2024",
    status: "open"

  },
  {
    title: "Junior Backend Developer",
    type: "Part-Time",
    description: "Join our backend team to help build scalable APIs.",
    company: {
      name: "Tech Innovators",
      contactEmail: "hr@techinnovators.com",
      contactPhone: "555-555-1234"
    },
    location: "Espoo",
    salary:"25",
    postedDate: "01-10-2024",
    status: "open"
  },
];

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called", async () => {
    const newJob = {
      title: "Mid-Level DevOps Engineer",
      type: "Full-Time",
      description: "We are looking for a DevOps Engineer to join our team.",
      company: {
        name: "Cloud Solutions",
        contactEmail: "jobs@cloudsolutions.com",
        contactPhone: "555-555-6789"
      },
      location: "Helsinki",
      salary : "20",
      postedDate: "01-09-2024",
      status: "open"

    };

    await api
      .post("/api/jobs")
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newJob.title);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });

  it("should return 400 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/jobs/:id
  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});

// ChatGpt:
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");

const jobs = [
  {
    title: "Senior React Developer",
    type: "Full-Time",
    description: "We are seeking a talented Front-End Developer to join our team in Boston, MA.",
    company: {
      name: "NewTek Solutions",
      contactEmail: "contact@teksolutions.com",
      contactPhone: "555-555-5555"
    },
    location: "Helsinki",
    salary: "20",
    postedDate: "01-09-2024",
    status: "open"
  },
  {
    title: "Junior Backend Developer",
    type: "Part-Time",
    description: "Join our backend team to help build scalable APIs.",
    company: {
      name: "Tech Innovators",
      contactEmail: "hr@techinnovators.com",
      contactPhone: "555-555-1234"
    },
    location: "Espoo",
    salary: "25",
    postedDate: "01-10-2024",
    status: "open"
  },
];

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs
  it("should create a new job when POST /api/jobs is called", async () => {
    const newJob = {
      title: "Mid-Level DevOps Engineer",
      type: "Full-Time",
      description: "We are looking for a DevOps Engineer to join our team.",
      company: {
        name: "Cloud Solutions",
        contactEmail: "jobs@cloudsolutions.com",
        contactPhone: "555-555-6789"
      },
      location: "Helsinki",
      salary: "20",
      postedDate: "01-09-2024",
      status: "open"
    };

    await api
      .post("/api/jobs")
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newJob.title);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract"
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });

  it("should return 400 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/jobs/:id
  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById (job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});
```
**Disscusion:** Chatgpt reformatted the code to follow a consistent coding style and removed unnecessary comments and whitespace to improve readability, the original code had some minor formatting issues and unnecessary comments.


```js
