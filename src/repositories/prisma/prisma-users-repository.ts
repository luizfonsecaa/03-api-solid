import { prisma } from '@/lib/prisma'
import { Prisma } from '../../../generated/prisma'
import { UserRepository } from '../users-repository'

export class PrismaUsersRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    })
  }
}
