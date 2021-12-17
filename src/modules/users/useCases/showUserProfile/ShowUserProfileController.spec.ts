import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { createConnectionApplication } from "../../../../database";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnectionApplication();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able show user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@mail.com",
      password: "123",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set("Authorization", `Bearer ${responseAuth.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("name");
  });
});
