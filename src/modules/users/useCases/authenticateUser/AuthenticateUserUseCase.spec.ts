import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user", () => {

  beforeEach(() => {
     inMemoryUsersRepository = new InMemoryUsersRepository();
     createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
     authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("must be able to authenticate the user and return the user's information.", async () => {

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "12345"
    });

    const u = await authenticateUserUseCase.execute({
      email: user.email,
      password: "12345"
    });

    expect(u.user.email).toBe("test@test.com");
  });

  it("should not be able to authenticate using incorrect email", () => {

    expect(async () => {
      await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "12345"
      });

      await authenticateUserUseCase.execute({
        email: "test@test1.com",
        password: "1234"
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate using incorrect password", () => {

    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "12345"
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234"
      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
