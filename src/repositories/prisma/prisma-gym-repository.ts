import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '../../../generated/prisma'

import { findmanyNearbyParams, GymRepository } from '../gyms-repository'

export class PrismaGymRepository implements GymRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }

  async findManyNearby({ latitude, longitude }: findmanyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
