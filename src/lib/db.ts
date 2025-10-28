import { prisma } from './prisma'

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      // Enhanced error logging for debugging
      console.error(`Database error on attempt ${attempt + 1}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
        attempt: attempt + 1,
        maxRetries: maxRetries + 1,
      })

      // Check if it's a connection error
      if (
        error instanceof Error &&
        (error.message.includes('prepared statement') ||
          error.message.includes('connection') ||
          error.message.includes('ConnectorError') ||
          error.message.includes('P1001') || // Connection error
          error.message.includes('P1008') || // Operation timeout
          error.message.includes('P1017') || // Server closed connection
          error.message.includes('ENOTFOUND') ||
          error.message.includes('ECONNREFUSED'))
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

  // At this point, we've exhausted all retries and lastError is guaranteed to be defined
  if (!lastError) {
    throw new Error('Retry operation failed without capturing an error')
  }

  throw lastError
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

// Diagnostic function to help debug database connection issues
export async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...')
    console.log('PRODUCTION_DATABASE_URL:', process.env.PRODUCTION_DATABASE_URL ? 'Set' : 'Not set')
    console.log('PRODUCTION_DIRECT_URL:', process.env.PRODUCTION_DIRECT_URL ? 'Set' : 'Not set')
    console.log('NODE_ENV:', process.env.NODE_ENV)

    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Database connection successful:', result)
    return { success: true, result }
  } catch (error) {
    console.error('Database connection failed:', error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}
