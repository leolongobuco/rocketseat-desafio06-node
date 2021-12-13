import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@email.com",
      name: "teste name",
      password: "123456",
    });
    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user if it is already registered", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "teste@email.com",
        name: "teste name",
        password: "123456",
      });

      await createUserUseCase.execute({
        email: "teste@email.com",
        name: "teste2 name",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
