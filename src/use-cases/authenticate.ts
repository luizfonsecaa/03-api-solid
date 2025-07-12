import { User } from './../../generated/prisma/index.d'
import { UserRepository } from '@repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError()
    }
    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }
    return {
      user,
    }
    // Implement JWT token generation and store it in the user's session
  }
}
