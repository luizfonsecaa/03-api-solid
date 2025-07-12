import { it, expect, describe, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@repositories/in-memory/in-memory-users-repository'
import { ResourceNotFound } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able found user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user: retrievedUser } = await sut.execute({
      id: user.id,
    })

    expect(retrievedUser).toEqual(user)
  })

  it('should not be able found user', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
