import { prisma } from '../config/prisma';

export const createTipoService = async (descricao: string) => {
  // Verifica se o tipo já existe para evitar duplicados
  const tipoExistente = await prisma.tipo.findUnique({ where: { descricao } });
  if (tipoExistente) {
    throw new Error('Este tipo já está cadastrado.');
  }

  return prisma.tipo.create({
    data: { descricao },
  });
};

export const getAllTiposService = async () => {
  return prisma.tipo.findMany();
};