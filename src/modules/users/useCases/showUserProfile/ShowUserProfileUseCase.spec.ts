import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

interface IRequest {
  user_id: string;
}
describe("Show user Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be show a user profile existent", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "teste@email.com",
      name: "teste name",
      password: "123456",
    });

    const user_id = user.id;

    const userProfile = await showUserProfileUseCase.execute(user_id);

    expect(userProfile.email).toEqual("teste@email.com");
  });
});
