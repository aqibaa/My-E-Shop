// lib/db.js
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Global object pay check karte hain taaki baar baar connection na bane development mein
const globalForPrisma = global

const db = globalForPrisma.prisma || prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db