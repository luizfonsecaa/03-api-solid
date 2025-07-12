import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from '@/use-cases/check-in'
import { Decimal } from 'generated/prisma/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(checkInsRepository, gymRepository)

    await gymRepository.create({
      id: 'gym-01',
      title: 'academia',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 18, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 18, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 18, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 19, 0, 0))

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).resolves.not.toThrow()
  })

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 18, 0, 0))

    await gymRepository.create({
      id: 'gym-02',
      title: 'academia',
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
