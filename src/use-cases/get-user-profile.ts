import { User } from './../../generated/prisma/index.d'
import { UserRepository } from '@repositories/users-repository'
import { ResourceNotFound } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseRequest {
  id: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    id,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new ResourceNotFound()
    }

    return {
      user,
    }
  }
}
