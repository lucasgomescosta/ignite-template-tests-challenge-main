import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Statement Operation", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to return at information of operations exists.", async () => {

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

    const getStatementOperation = await getStatementOperationUseCase.execute({
      user_id: u.user.id,
      statement_id: statementOperation.id
    });

    expect(getStatementOperation.description).toBe("deposit");
  });

  it("should not be able get statement operation non-existent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "user",
        statement_id: "sample"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able user non-existent operation statement show!", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "test",
        email: "test@test.com",
        password: "1234"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "sample"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
