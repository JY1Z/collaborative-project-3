const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); 
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require('../models/userModel');

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
    salary: 20000,
    postedDate: "2024-01-09",
    status: "open"
  },
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    username: "johndoe", 
    password: "securePassword123",
    phone_number: "+1234567890",
    gender: "male",
    date_of_birth: "1990-01-01",
    membership_status: "active",
    address: "1234 Elm Street, Springfield, IL, USA",
    profile_picture: "https://example.com/profile/johndoe.jpg",
  });
  token = result.body.token;
});


describe("Job Controller", () => {
  // Test POST /api/jobs (Create)
  it("should create a new job when POST /api/jobs is called", async () => {
    const newJob =   {
        title: "Junior Backend Developer",
        type: "Part-Time",
        description: "Join our backend team to help build scalable APIs.",
        company: {
          name: "Tech Innovators",
          contactEmail: "hr@techinnovators.com",
          contactPhone: "555-555-1234"
        },
        location: "Espoo",
        salary: 25000,
        postedDate: "2024-01-10",
        status: "open"
    }

    await api
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)  
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobTitles = jobsAfterPost.map((job) => job.title);
    expect(jobTitles).toContain(newJob.title);
  });

  // Test PUT /api/jobs/:id (Update)
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      description: "Updated description",
      type: "Contract"
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", `Bearer ${token}`) 
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
    expect(updatedJobCheck.type).toBe(updatedJob.type);
  });

  // Test DELETE /api/jobs/:id (Delete)
  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).set("Authorization", `Bearer ${token}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).set("Authorization", `Bearer ${token}`).send({}).expect(400);
  });

})

afterAll(() => {
    mongoose.connection.close();
  });