import request from "supertest";

import { app } from "@shared/infra/http/app";

import { Connection, createConnection } from "typeorm";

let connection: Connection;

describe("Create User Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll( async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able create user controller", async () => {

    const response = await request(app).post("/api/v1/users")
      .send({
        name: "user 1",
        email: "test@test.com",
        password: "1234"
      });

    expect(response.status).toBe(201);
  });



})
