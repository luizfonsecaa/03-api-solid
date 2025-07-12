import { PrismaGymRepository } from '@/repositories/prisma/prisma-gym-repository'
import { SearchGymsUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}
