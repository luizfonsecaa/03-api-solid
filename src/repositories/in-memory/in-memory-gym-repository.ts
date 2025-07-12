import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates'
import { Gym, Prisma } from '../../../generated/prisma'
import { findmanyNearbyParams, GymRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
export class InMemoryGymRepository implements GymRepository {
  public items: Gym[] = []
  findById(id: string): Promise<Gym | null> {
    return new Promise((resolve, reject) => {
      const gym = this.items.find((item) => item.id === id)

      if (!gym) return resolve(null)

      return resolve(gym)
    })
  }

  create(data: Prisma.GymCreateInput): Promise<Gym> {
    return new Promise((resolve, reject) => {
      const gym = {
        id: data.id ?? randomUUID(),
        title: data.title,
        description: data.description ?? null,
        phone: data.phone ?? null,
        latitude: new Prisma.Decimal(data.latitude.toString()),
        longitude: new Prisma.Decimal(data.longitude.toString()),
        created_at: new Date(),
      }

      this.items.push(gym)
      resolve(gym)
    })
  }

  searchMany(query: string, page: number): Promise<Gym[]> {
    return new Promise((resolve, reject) => {
      const gyms = this.items
        .filter((gym) => gym.title.includes(query))
        .slice((page - 1) * 20, page * 20)

      resolve(gyms)
    })
  }

  findManyNearby(params: findmanyNearbyParams): Promise<Gym[]> {
    return new Promise((resolve, reject) => {
      const gyms = this.items.filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: params.latitude, longitude: params.longitude },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        )
        return distance <= 10
      })
      resolve(gyms)
    })
  }
}
