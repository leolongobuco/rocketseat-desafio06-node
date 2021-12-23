import {
  OperationType,
  Statement,
} from "modules/statements/entities/Statement";
import { IStatementsRepository } from "modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "modules/users/repositories/IUsersRepository";
import { AppError } from "shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  sender_id: string;
  amount: number;
  description: string;
  user_id: string;
}

@injectable()
class CreateTransferStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}
  async execute({
    amount,
    description,
    sender_id,
    user_id,
  }: IRequest): Promise<Statement> {
    const userSender = await this.usersRepository.findById(sender_id);

    if (!userSender) throw new AppError("User sender not found!");

    const recipient = await this.usersRepository.findById(user_id);

    if (!recipient) throw new AppError("User recipient does not exists!");

    const balance = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance.balance < amount) throw new AppError("Insufficient fund");

    const statement = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    return statement;
  }
}

export { CreateTransferStatementUseCase };
