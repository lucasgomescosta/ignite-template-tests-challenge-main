import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });


  it("should be able to create a new statement", async () => {

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "1234"
    });

    const u = await authenticateUserUseCase.execute({
      email: user.email,
      password: "1234"
    });

    const u1 = "/api/v1/statements/deposit";
    const urlsplit = u1.split("/");

    const type = urlsplit[urlsplit.length - 1] as OperationType;

    const statementOperation = await createStatementUseCase.execute({
      user_id: u.user.id,
      amount: 250.0,
      type,
      description: "deposit"
    });

    expect(statementOperation.description).toBe("deposit");
  });


  it("should not be able create statement non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user",
        amount: 250.0,
        type: 'any_type' as any,
        description: "sample"
      });

    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });


  it("should not be able to carry out a withdrawal operation if you have a lower account balance.", () => {

    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "1234"
      });

      const u = await authenticateUserUseCase.execute({
        email: user.email,
        password: "1234"
      });

      const u1 = "/api/v1/statements/withdraw";
      const urlsplit = u1.split("/");

      const type = urlsplit[urlsplit.length - 1] as OperationType;

      await createStatementUseCase.execute({
        user_id: u.user.id,
        amount: 250.0,
        type,
        description: "sample"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

})
