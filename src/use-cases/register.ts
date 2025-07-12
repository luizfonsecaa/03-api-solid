import { hash } from 'bcryptjs'
import { UserRepository } from '@repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from './../../generated/prisma/index.d'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const passwordHash = await hash(password, 6)

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash: passwordHash,
    })

    return {
      user,
    }
  }
}
