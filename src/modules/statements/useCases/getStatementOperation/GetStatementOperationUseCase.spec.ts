import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operations", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able search statements operations of a user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User test",
      email: "user@test.com",
      password: "1234",
    });

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1200,
      description: "pagamento",
      type: OperationType.DEPOSIT,
    });

    const statementOperations = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(statementOperations).toHaveProperty("id");
  });

  it("should not be able search statement operations if user not exists", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "User test2",
        email: "user@test2.com",
        password: "12345",
      });

      const statement = await inMemoryStatementsRepository.create({
        user_id: "123456",
        amount: 1200,
        description: "pagamento",
        type: OperationType.DEPOSIT,
      });

      await getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: statement.id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able search statement operations if statement not exists", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "User test2",
        email: "user@test2.com",
        password: "12345",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "1234",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
