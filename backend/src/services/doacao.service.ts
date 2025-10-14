import { prisma } from '../config/prisma';

// Interface para cada item na lista da requisição
interface ItemInput {
  tipoId: number;
  tamanhoId: number;
  condicaoId: number;
  quantidade: number;
}

// Interface para o corpo completo da requisição
interface CreateDoacaoInput {
  voluntarioId: number;
  itens: ItemInput[];
}

export const createDoacaoService = async (input: CreateDoacaoInput) => {
  const { voluntarioId, itens } = input;

  const novaDoacao = await prisma.$transaction(async (tx) => {
    // Cria o registro do "evento" da Doação.
    const doacao = await tx.doacao.create({
      data: {
        voluntarioId: voluntarioId,
      },
    });

    // Para cada item na doação, verifica se já existe no catálogo e atualiza ou cria conforme necessário.
    for (const itemDaDoacao of itens) {
      const itemNoCatalogo = await tx.item.upsert({

        where: {
          tipoId_tamanhoId_condicaoId: {
            tipoId: itemDaDoacao.tipoId,
            tamanhoId: itemDaDoacao.tamanhoId,
            condicaoId: itemDaDoacao.condicaoId,
          },
        },
        // Se o item já existir, atualiza a quantidade em estoque.
        update: {
          quantidadeEstoque: {
            increment: itemDaDoacao.quantidade,
          },
        },
        // Se o item não for encontrado, cria um novo registro no catálogo.
        create: {
          quantidadeEstoque: itemDaDoacao.quantidade,
          tipo: {
            connect: { id: itemDaDoacao.tipoId },
          },
          tamanho: {
            connect: { id: itemDaDoacao.tamanhoId },
          },
          condicao: {
            connect: { id: itemDaDoacao.condicaoId },
          },
        },
      });

      // Cria o registro na tabela de ligação 'ItemDoacao'.
      await tx.itemDoacao.create({
        data: {
          doacaoId: doacao.id,
          itemId: itemNoCatalogo.id,
          quantidade: itemDaDoacao.quantidade,
        },
      });
    }

    // Retorna a doação completa para a resposta da API.
    return tx.doacao.findUnique({
      where: { id: doacao.id },
      include: {
        itens: {
          include: {
            item: true,
          },
        },
      },
    });
  });

  return novaDoacao;
};