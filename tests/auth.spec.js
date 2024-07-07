const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/utils/pool");

describe("Auth", () => {
  beforeAll(async () => {
    // Set up the test database connection
    await pool.query("CREATE TABLE users (...)");
    await pool.query("CREATE TABLE organisations (...)");
  });

  afterAll(async () => {
    // Clean up the test database
    await pool.query("DROP TABLE users");
    await pool.query("DROP TABLE organisations");
    await pool.end();
  });

  it("Should generate a valid JWT token", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toBeDefined();

    const token = response.body.data.accessToken;
    const decoded = jwt.verify(token, "your_secret_key");
    expect(decoded.userId).toBeDefined();
    expect(decoded.email).toBe("john@example.com");
  });

  it("Should not allow access to other organisations", async () => {
    // Register two users and create organisations
    const user1Response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    });
    const user1Token = user1Response.body.data.accessToken;

    const user2Response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      password: "password123",
    });
    const user2Token = user2Response.body.data.accessToken;

    // User 1 tries to access User 2's organisation
    const response = await request(app)
      .get("/api/organisations/user2-org-id")
      .set("Authorization", `Bearer ${user1Token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Organisation not found");
  });
});

const request = require("supertest");
const app = require("../app");
const db = require("../db");

describe("Auth", () => {
  beforeAll(async () => {
    // Set up the test database connection
    await db.query("CREATE TABLE users (...)");
    await db.query("CREATE TABLE organisations (...)");
  });

  afterAll(async () => {
    // Clean up the test database
    await db.query("DROP TABLE users");
    await db.query("DROP TABLE organisations");
    await db.end();
  });

  it("Should register a user successfully with a default organisation", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Registration successful");
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.userId).toBeDefined();
    expect(response.body.data.user.firstName).toBe("John");
    expect(response.body.data.user.lastName).toBe("Doe");
  });
});
