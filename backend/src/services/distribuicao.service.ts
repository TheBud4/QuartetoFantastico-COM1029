import { prisma } from '../config/prisma';
import { CreateDistribuicaoSchemaType } from '../validators/distribuicao.validator';

/**
 * Cria uma nova distribuição, registrando os itens e dando baixa no estoque.
 * Este processo é transacional.
 */
export const createDistribuicaoService = async (data: CreateDistribuicaoSchemaType, voluntarioId: number) => {
    const { beneficiarioId, itens } = data;

    // --- 1. Verificações Prévias (Fora da Transação) ---

    // Verificar se o voluntário e o beneficiário existem
    const [voluntario, beneficiario] = await Promise.all([
        prisma.voluntario.findUnique({ where: { id: voluntarioId } }),
        prisma.beneficiario.findUnique({ where: { id: beneficiarioId } })
    ]);

    if (!voluntario) throw new Error('Voluntário não encontrado.');
    if (!beneficiario) throw new Error('Beneficiário não encontrado.');

    // Verificar estoque para TODOS os itens da lista, buscando pelo composto (tipo/tamanho/condição)
    const itensNoBanco = await prisma.item.findMany({
        where: {
            OR: itens.map((i) => ({
                tipoId: i.tipoId,
                tamanhoId: i.tamanhoId,
                condicaoId: i.condicaoId,
            })),
        },
    });

    const estoqueMap = new Map(
        itensNoBanco.map(item => [
            `${item.tipoId}-${item.tamanhoId}-${item.condicaoId}`,
            { id: item.id, quantidade: item.quantidadeEstoque }
        ])
    );

    for (const item of itens) {
        const key = `${item.tipoId}-${item.tamanhoId}-${item.condicaoId}`;
        const registro = estoqueMap.get(key);

        if (!registro) {
            throw new Error(`Item (tipo ${item.tipoId}, tamanho ${item.tamanhoId}, condição ${item.condicaoId}) não encontrado no estoque.`);
        }
        if (registro.quantidade < item.quantidade) {
            throw new Error(`Estoque insuficiente para o item (tipo ${item.tipoId}, tamanho ${item.tamanhoId}, condição ${item.condicaoId}). Disponível: ${registro.quantidade}, solicitado: ${item.quantidade}.`);
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
        const itensDistribuidos = [];
        for (const item of itens) {
            const key = `${item.tipoId}-${item.tamanhoId}-${item.condicaoId}`;
            const registro = estoqueMap.get(key);
            if (!registro) {
                throw new Error(`Item não encontrado para distribuição (tipo ${item.tipoId}, tamanho ${item.tamanhoId}, condição ${item.condicaoId}).`);
            }

            await tx.itemDistribuicao.create({
                data: {
                    distribuicaoId: distribuicao.id,
                    itemId: registro.id,
                    quantidade: item.quantidade,
                },
            });

            await tx.item.update({
                where: { id: registro.id },
                data: {
                    quantidadeEstoque: {
                        decrement: item.quantidade,
                    },
                },
            });

            itensDistribuidos.push(registro.id);
        }

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
