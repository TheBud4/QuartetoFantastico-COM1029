import { PrismaClient } from '@prisma/client';

// Cria e exporta uma instância única do PrismaClient
export const prisma = new PrismaClient();