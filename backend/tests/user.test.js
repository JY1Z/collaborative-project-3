const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const User = require("../models/userModel");

const users = [
  {
    name: "John Doe",
    username: "johndoe123",
    password: "securePassword123",  
    phone_number: "+1234567890",
    gender: "male",
    date_of_birth: new Date('1990-05-15'),
    membership_status: "active",
    address: "1234 Elm Street, Springfield, IL, USA",
    profile_picture: "https://example.com/profile/johndoe.jpg", 
  },
  {
    name: "Jane Smith",
    username: "janesmith456",
    password: "mySuperSecretPassword!",  
    phone_number: "+0987654321",
    gender: "female",
    date_of_birth: new Date('1985-08-22'),
    membership_status: "inactive",
    address: "5678 Oak Street, Denver, CO, USA",
    profile_picture: "https://example.com/profile/janesmith.png", 
  }
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

describe("Given there are initially some users saved", () => {
  beforeEach(async () => {
    await User.deleteMany({ username: { $ne: "johndoe" } });
    
    await api.post("/api/users/signup").send(users[0]);
    await api.post("/api/users/signup").send(users[1]);
  });

  it("should return the current authenticated user's profile when GET /api/users/me is called", async () => {
    await api
      .get("/api/users/me")
      .set("Authorization", "bearer " + token)  
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should create one user when POST /api/users/signup is called", async () => {
    const newUser = {
      name: "Alice Green",
      username: "alicegreen789",
      password: "newSecurePassword!",
      phone_number: "+1231231234",
      gender: "female",
      date_of_birth: "1992-06-10",
      membership_status: "active",
      address: "4321 Pine Street, Seattle, WA, USA",
      profile_picture: "https://example.com/profile/janesmith.png",
    };
    await api
      .post("/api/users/signup")  
      .send(newUser)
      .expect(201);
  });

  it("should login a user and return a token when POST /api/users/login is called", async () => {
    const loginUser = {
      username: "johndoe", 
      password: "securePassword123",
    };

    const response = await api
      .post("/api/users/login") 
      .send(loginUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.token).toBeDefined();

    await api
      .get("/api/users/me")
      .set("Authorization", "bearer " + response.body.token)  
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();  
});
