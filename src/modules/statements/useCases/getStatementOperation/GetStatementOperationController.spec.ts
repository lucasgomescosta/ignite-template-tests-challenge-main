import request from "supertest";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from 'uuid';

import { app } from "@shared/infra/http/app";

import { Connection, createConnection } from "typeorm";
let connection: Connection;
describe("Get Balamnce Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    //const id = uuidV4();
    //const password = await hash("admin", 8);

    /*await connection.query(
      `INSERT INTO USERS (id, name, email, password, created_at, updated_at)
        values('${id}', 'user 5', 'test5@test5.com.br', '${password}', 'now()', 'now()')
      `
    );*/
  });

  afterAll(async () => {
    //await connection.dropDatabase();
    await connection.close();
  });

  it("should be able get balance.", async () => {

    const responseToken = await request(app).post("/api/v1/sessions")
    .send({
      email: "test4@test4.com.br",
      password: "admin"
    });

    const { token, user } = responseToken.body;

    const response = await request(app)
                      .get("/api/v1/statements/b321c1f2-844f-4003-b194-ce55cc752f41")
                      .set({
                        Authorization: `Bearer ${token}`
                      });

    expect(response.body.description).toBe("Teste supertest");
    expect(response.body).toHaveProperty("id");
    expect(response.body.user_id).toEqual(user.id)
    expect(response.body.type).toBe("deposit");
  });

});
