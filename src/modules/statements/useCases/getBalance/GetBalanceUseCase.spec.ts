import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able search balance user's infos", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User test",
      email: "user@test.com",
      password: "1234",
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1200,
      description: "pagamento",
      type: OperationType.DEPOSIT,
    });

    await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 200,
      description: "pagamento",
      type: OperationType.WITHDRAW,
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance.balance).toBe(1000);
  });

  it("should not be able search balance if user not exists", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "User test",
        email: "user@test.com",
        password: "1234",
      });

      await getBalanceUseCase.execute({ user_id: "12345" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
