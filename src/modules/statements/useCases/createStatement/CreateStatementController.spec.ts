import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';

import { app } from "@shared/infra/http/app";

import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Create Statement Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at, updated_at)
        values('${id}', 'user 4', 'test4@test4.com.br', '${password}', 'now()', 'now()')
      `
    );
  });

  afterAll(async () => {
    //await connection.dropDatabase();
    await connection.close();
  });

  it("should be able create statement deposit controller.", async () => {

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "test4@test4.com.br",
      password: "admin"
    });

    const { token } = responseToken.body;

    const response = await request(app)
                      .post("/api/v1/statements/deposit")
                      .send({
                        amount: 200,
                        description: "Teste supertest"
                      })
                      .set({
                        Authorization: `Bearer ${token}`
                      });

    expect(response.body.description).toBe("Teste supertest");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe("deposit");
  });

  it("should be able create statement withdraw controller.", async () => {

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "test4@test4.com.br",
      password: "admin"
    });

    const { token } = responseToken.body;

    const response = await request(app)
                      .post("/api/v1/statements/withdraw")
                      .send({
                        amount: 150,
                        description: "Teste"
                      })
                      .set({
                        Authorization: `Bearer ${token}`
                      });

    expect(response.status).toBe(201);
    expect(response.body.description).toBe("Teste");
    expect(response.body).toHaveProperty("user_id");
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe("withdraw");
  });
});
