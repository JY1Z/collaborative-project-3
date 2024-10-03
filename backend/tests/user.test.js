const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const User = require("../models/userModel");

const users = [
  {
    name: "John Doe",
    username: "johndoe123",
    password: "securePassword123", // 密码在实际应用中应加密
    phone_number: "+1234567890",
    gender: "male",
    date_of_birth: new Date('1990-05-15'),
    membership_status: "active",
    address: "1234 Elm Street, Springfield, IL, USA",
    profile_picture: "https://example.com/profile/johndoe.jpg", // 可选字段
  },
  {
    name: "Jane Smith",
    username: "janesmith456",
    password: "mySuperSecretPassword!", // 密码在实际应用中应加密
    phone_number: "+0987654321",
    gender: "female",
    date_of_birth: new Date('1985-08-22'),
    membership_status: "inactive",
    address: "5678 Oak Street, Denver, CO, USA",
    profile_picture: "https://example.com/profile/janesmith.png", // 可选字段
  }
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  // 注册一个用户并获取 token
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    username: "uniquejohndoe123", // 使用唯一用户名
    password: "securePassword123",
    phone_number: "+1234567890",
    gender: "male",
    date_of_birth: "1990-01-01",
    membership_status: "active",
    address: "1234 Elm Street, Springfield, IL, USA",
    profile_picture: "https://example.com/profile/johndoe.jpg",
  });
  // 存储返回的 token
  token = result.body.token;
});

describe("Given there are initially some users saved", () => {
  beforeEach(async () => {
    // 不要删除所有用户，保留之前创建的用户
    await User.deleteMany({ username: { $ne: "uniquejohndoe123" } });
    
    // 创建测试用户，不需要 Authorization 标头
    await api.post("/api/users/signup").send(users[0]);
    await api.post("/api/users/signup").send(users[1]);
  });

  it("should return the current authenticated user's profile when GET /api/users/me is called", async () => {
    await api
      .get("/api/users/me")
      .set("Authorization", "bearer " + token) // 使用之前获取的 token
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
      .post("/api/users/signup") // 注册新用户不需要 Authorization
      .send(newUser)
      .expect(201);
  });

  it("should return the current authenticated user's profile when GET /api/users/me is called", async () => {
    await api
      .get("/api/users/me")
      .set("Authorization", "bearer " + token) // 确保 token 正确传递
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close(); // 关闭数据库连接
});
