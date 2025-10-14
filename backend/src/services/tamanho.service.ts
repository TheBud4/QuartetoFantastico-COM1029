import { prisma } from '../config/prisma';

export const createTamanhoService = async (descricao: string, tipoId: number) => {
  // Verifica se a combinação de descrição e tipoId já existe
  const tamanhoExistente = await prisma.tamanho.findUnique({
    where: { 
      descricao_tipoId: {
        descricao,
        tipoId,
      } 
    },
  });

  if (tamanhoExistente) {
    throw new Error('Este tamanho já está cadastrado para este tipo.');
  }

  return prisma.tamanho.create({
    data: {
      descricao,
      tipoId,
    },
  });
};

// O serviço pode receber um tipoId opcional para filtrar
export const getAllTamanhosService = async (tipoId?: number) => {
  return prisma.tamanho.findMany({
    where: {
      tipoId: tipoId ? tipoId : undefined,
    },
  });
};