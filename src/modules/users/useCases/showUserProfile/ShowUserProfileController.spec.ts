import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';

import { app } from "@shared/infra/http/app";

import { Connection, createConnection } from "typeorm";
import { User } from "@modules/users/entities/User";

let connection: Connection;
describe("Show User Profile Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at, updated_at)
        values('${id}', 'user 3', 'test3@test3.com.br', '${password}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    //await connection.dropDatabase();
    await connection.close();
  });

  it("should be able show profile user.", async () => {

    const responseToken = await request(app).post("/api/v1/sessions")
      .send({
        email: "test3@test3.com.br",
        password: "admin"
      });

    const { token } = responseToken.body;

    const response = await request(app)
                        .get("/api/v1/profile")
                        .set({
                          Authorization: `Bearer ${token}`
                        });

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("user 3");
    expect(response.body.email).toBe("test3@test3.com.br");
  });
})
