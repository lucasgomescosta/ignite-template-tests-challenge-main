import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';

import { app } from "@shared/infra/http/app";

import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Authenticate user", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at, updated_at)
        values('${id}', 'user 2', 'test2@test2.com.br', '${password}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate user.", async () => {
    const response = await request(app).post("/api/v1/sessions")
      .send({
        email: "test2@test2.com.br",
        password: "admin"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
