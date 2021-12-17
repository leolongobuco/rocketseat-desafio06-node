import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { createConnectionApplication } from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnectionApplication();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able authenticate user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@mail.com",
      password: "123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should not be able authenticate user with email incorrect", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "incorrect mail",
      password: "123",
    });

    expect(response.status).toBe(401);
  });

  it("should not be able authenticate user with password incorrect", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@mail.com",
      password: "incorrect password",
    });

    expect(response.status).toBe(401);
  });
});
