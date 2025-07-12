import { Gym, Prisma } from '../../generated/prisma'

export interface findmanyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: findmanyNearbyParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
