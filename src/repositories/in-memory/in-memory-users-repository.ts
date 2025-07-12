import { randomUUID } from 'node:crypto'
import { User, Prisma } from '../../../generated/prisma'
import { UserRepository } from '../users-repository'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []

  create(data: Prisma.UserCreateInput): Promise<User> {
    return new Promise((resolve, reject) => {
      const user = {
        id: randomUUID(),
        name: data.name,
        email: data.email,
        password_hash: data.password_hash,
        created_at: new Date(),
      }

      this.items.push(user)
      resolve(user)
    })
  }

  findById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const user = this.items.find((item) => item.id === id)
      if (!user) return resolve(null)
      return resolve(user)
    })
  }

  findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const user = this.items.find((item) => item.email === email)
      if (!user) return resolve(null)
      return resolve(user)
    })
  }
}
