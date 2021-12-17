import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { createConnectionApplication } from "../../../../database";

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnectionApplication();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new statement", async () => {
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
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit",
      })
      .set("Authorization", `Bearer ${responseAuth.body.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("amount", 100);
    expect(response.body).toHaveProperty("description", "Deposit");
  });
});
