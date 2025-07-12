import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '../../../generated/prisma'
import { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    return new Promise((resolve) => {
      const checkIn = this.items.find(
        (item) =>
          item.user_id === userId &&
          item.created_at.toDateString() === date.toDateString(),
      )
      resolve(checkIn || null)
    })
  }

  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    return new Promise((resolve) => {
      const checkIn = {
        id: randomUUID(),
        user_id: data.user_id,
        gym_id: data.gym_id,
        validated_at: data.validated_at ? new Date(data.validated_at) : null,
        created_at: new Date(),
      }

      this.items.push(checkIn)
      resolve(checkIn)
    })
  }

  findById(id: string): Promise<CheckIn | null> {
    return new Promise((resolve) => {
      const checkIn = this.items.find((item) => item.id === id)
      resolve(checkIn || null)
    })
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return new Promise((resolve) => {
      const checkIns = this.items
        .filter((item) => item.user_id === userId)
        .slice((page - 1) * 20, page * 20)
      resolve(checkIns)
    })
  }

  countByUserId(userId: string): Promise<number> {
    return new Promise((resolve) => {
      const checkIns = this.items.filter((item) => item.user_id === userId)
      resolve(checkIns.length)
    })
  }

  save(checkIn: CheckIn): Promise<void> {
    return new Promise((resolve, rejects) => {
      const checkInIndex = this.items.findIndex(
        (item) => item.id === checkIn.id,
      )
      if (checkInIndex === -1) throw new Error('Check-in not found')
      this.items[checkInIndex] = checkIn
      resolve()
    })
  }
}
