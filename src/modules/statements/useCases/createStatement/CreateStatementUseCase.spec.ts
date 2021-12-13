import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatmentUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatmentUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User test",
      email: "user@test.com",
      password: "1234",
    });

    const statement = await createStatmentUseCase.execute({
      user_id: user.id,
      amount: 1200,
      description: "pagamento",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("user_id");
  });

  it("should not be able to create a new statement with user not exists", async () => {
    expect(async () => {
      await createStatmentUseCase.execute({
        user_id: "12345",
        amount: 1200,
        description: "pagamento",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement with user not exists", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "User test3",
        email: "user@test3.com",
        password: "1234",
      });

      await createStatmentUseCase.execute({
        user_id: user.id,
        amount: 1200,
        description: "pagamento",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
