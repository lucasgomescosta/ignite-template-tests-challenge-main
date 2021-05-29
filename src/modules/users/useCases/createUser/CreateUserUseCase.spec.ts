import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "1234"
    });

    expect(user.name).toBe("test");
  });

  it("should not be able to create a user if there is an email already registered", () => {
    expect(async () => {

      await createUserUseCase.execute({
        name: "user 1",
        email: "test@test.com",
        password: "1234"
      });

      await createUserUseCase.execute({
        name: "user 2",
        email: "test@test.com",
        password: "12345"
      });

    }).rejects.toBeInstanceOf(AppError);
  });
})
