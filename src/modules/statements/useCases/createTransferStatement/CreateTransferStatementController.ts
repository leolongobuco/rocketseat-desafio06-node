import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

class CreateTransferStatementController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const { description, amount } = request.body;

    const { id: sender_id } = request.user;

    const createTransferStatementUseCase = container.resolve(
      CreateTransferStatementUseCase
    );

    const transfer = await createTransferStatementUseCase.execute({
      amount,
      description,
      sender_id,
      user_id,
    });

    return response.json(transfer);
  }
}

export { CreateTransferStatementController };
