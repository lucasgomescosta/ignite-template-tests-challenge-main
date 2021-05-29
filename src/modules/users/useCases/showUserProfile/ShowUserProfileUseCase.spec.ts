import { AuthenticateUserUseCase } from '@modules/users/useCases/authenticateUser/AuthenticateUserUseCase';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { AppError } from '@shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able return inform of user", async () => {

    const user = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "12345"
    });

    const u = await authenticateUserUseCase.execute({
      email: user.email,
      password: "12345"
    });

    const user1 = await showUserProfileUseCase.execute(u.user.id);

    expect(user1.email).toBe("test@test.com");
  });

  it("should not be able to show the information of a non-existent user", () => {
    expect(async () => {
      const user = ({
        id: "2335",
        name: "test",
        email: "test@test.com",
        password: "12345"
      });

      await showUserProfileUseCase.execute(user.id);

    }).rejects.toBeInstanceOf(AppError);
  });
});
