import { prisma } from '../config/prisma';

export const createCondicaoService = async (descricao: string) => {
  // Verifica se a condição já existe para evitar duplicados
  const condicaoExistente = await prisma.condicao.findUnique({ where: { descricao } });
  if (condicaoExistente) {
    throw new Error('Esta condição já está cadastrada.');
  }

  return prisma.condicao.create({
    data: { descricao },
  });
};

export const getAllCondicoesService = async () => {
  return prisma.condicao.findMany();
};