import "reflect-metadata"
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("GetBalance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("returns a list of all deposit and withdrawal operations for the authenticated user and also the total balance in a balance property ", async () => {

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "1234"
    });

    const u = await authenticateUserUseCase.execute({
      email: user.email,
      password: "1234"
    });

    const balance = await getBalanceUseCase.execute({
      user_id: u.user.id
    });

    expect(balance).toHaveProperty("balance");
  });

  it("must not be able to return deposit and withdrawal information and the total user balance does not exist!", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "user test"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
