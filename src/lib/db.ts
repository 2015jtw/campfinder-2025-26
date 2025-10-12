import { prisma } from './prisma'

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Check if it's a connection error
      if (
        error instanceof Error &&
        (error.message.includes('prepared statement') ||
          error.message.includes('connection') ||
          error.message.includes('ConnectorError'))
      ) {
        console.warn(`Database connection error on attempt ${attempt + 1}, retrying...`)

        // Disconnect and reconnect
        try {
          await prisma.$disconnect()
          await prisma.$connect()
        } catch (reconnectError) {
          console.error('Failed to reconnect to database:', reconnectError)
        }

        // Continue to next attempt
        continue
      }

      // If it's not a connection error, throw immediately
      throw error
    }
  }

  throw lastError!
}

export async function findProfile(userId: string) {
  return withRetry(() =>
    prisma.profile.findUnique({
      where: { id: userId },
      select: { id: true, displayName: true, avatarUrl: true },
    })
  )
}

export async function findProfileForLayout(userId: string) {
  return withRetry(() =>
    prisma.profile.findUnique({
      where: { id: userId },
      select: { displayName: true, avatarUrl: true },
    })
  )
}
