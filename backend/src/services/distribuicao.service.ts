import { prisma } from '../config/prisma';
import { CreateDistribuicaoSchemaType } from '../validators/distribuicao.validator';

/**
 * Cria uma nova distribuição, registrando os itens e dando baixa no estoque.
 * Este processo é transacional.
 */
export const createDistribuicaoService = async (data: CreateDistribuicaoSchemaType) => {
    const { voluntarioId, beneficiarioId, itens } = data;

    // --- 1. Verificações Prévias (Fora da Transação) ---

    // Verificar se o voluntário e o beneficiário existem
    const [voluntario, beneficiario] = await Promise.all([
        prisma.voluntario.findUnique({ where: { id: voluntarioId } }),
        prisma.beneficiario.findUnique({ where: { id: beneficiarioId } })
    ]);

    if (!voluntario) throw new Error('Voluntário não encontrado.');
    if (!beneficiario) throw new Error('Beneficiário não encontrado.');

    // Verificar estoque para TODOS os itens da lista
    const itemIds = itens.map(item => item.itemId);
    const itensNoBanco = await prisma.item.findMany({
        where: { id: { in: itemIds } },
    });

    // Mapeia para facilitar a consulta
    const estoqueMap = new Map(itensNoBanco.map(item => [item.id, item.quantidadeEstoque]));

    for (const item of itens) {
        const estoqueDisponivel = estoqueMap.get(item.itemId);

        if (estoqueDisponivel === undefined) {
            throw new Error(`Item com ID ${item.itemId} não encontrado no estoque.`);
        }
        if (estoqueDisponivel < item.quantidade) {
            throw new Error(`Estoque insuficiente para o item ID ${item.itemId}. Disponível: ${estoqueDisponivel}, Solicitado: ${item.quantidade}.`);
        }
    }

    // --- 2. Início da Transação ---
    // Se todas as verificações passarem, executa a transação.

    return prisma.$transaction(async (tx) => {
        // a. Criar o registro principal da Distribuição
        const distribuicao = await tx.distribuicao.create({
            data: {
                voluntarioId,
                beneficiarioId,
            },
        });

        // b. Criar os registros em ItemDistribuicao (o "recibo")
        await tx.itemDistribuicao.createMany({
            data: itens.map(item => ({
                distribuicaoId: distribuicao.id,
                itemId: item.itemId,
                quantidade: item.quantidade,
            })),
        });

        // c. Atualizar (dar baixa) no estoque na tabela Item
        const operacoesDeBaixa = itens.map(item =>
            tx.item.update({
                where: { id: item.itemId },
                data: {
                    quantidadeEstoque: {
                        decrement: item.quantidade,
                    },
                },
            })
        );

        await Promise.all(operacoesDeBaixa);

        return distribuicao; // Retorna a distribuição criada
    });
};

/**
 * Lista todas as distribuições com detalhes.
 */
export const getAllDistribuicoesService = async () => {
    return prisma.distribuicao.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            voluntario: {
                select: { nome: true },
            },
            beneficiario: {
                select: { nome: true },
            },
            // Pega os itens da distribuição e seus detalhes
            itens: {
                select: {
                    quantidade: true,
                    item: {
                        select: {
                            id: true,
                            tipo: { select: { descricao: true } },     // ex: "Camisa"
                            tamanho: { select: { descricao: true } }, // ex: "M"
                            condicao: { select: { descricao: true } } // ex: "Novo"
                        }
                    }
                }
            }
        }
    });
};

/**
 * Busca uma distribuição específica pelo ID.
 */
export const getDistribuicaoByIdService = async (id: number) => {
    const distribuicao = await prisma.distribuicao.findUnique({
        where: { id },
        include: {
            voluntario: { select: { nome: true } },
            beneficiario: { select: { nome: true } },
            itens: {
                select: {
                    quantidade: true,
                    item: {
                        select: {
                            id: true,
                            tipo: { select: { descricao: true } },
                            tamanho: { select: { descricao: true } },
                            condicao: { select: { descricao: true } }
                        }
                    }
                }
            }
        }
    });

    if (!distribuicao) {
        throw new Error('Distribuição não encontrada.');
    }
    return distribuicao;
};