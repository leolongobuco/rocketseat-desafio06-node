import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { createConnectionApplication } from "../../../../database";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnectionApplication();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able create user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able create user with email is already exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "John Tre",
      email: "johndoe@mail.com",
      password: "123",
    });

    expect(response.status).toBe(400);
  });
});
