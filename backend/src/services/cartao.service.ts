import { prisma } from '../config/prisma';
import { CreateCartaoSchemaType } from '../validators/cartao.validator';
// Importa as novas funções de geração
import { generateCardNumber, generateCVV } from '../utils/cartao.utils';

export const createCartaoService = async (data: CreateCartaoSchemaType) => {
    // 1. Verificar se o beneficiário existe
    const beneficiario = await prisma.beneficiario.findUnique({
        where: { id: data.beneficiarioId },
    });
    if (!beneficiario) {
        throw new Error('Beneficiário não encontrado.');
    }

    // 2. Verificar a regra 1:1 (Beneficiário já tem cartão?)
    const cartaoExistente = await prisma.cartaoBeneficiario.findUnique({
        where: { beneficiarioId: data.beneficiarioId },
    });
    if (cartaoExistente) {
        throw new Error('Este beneficiário já possui um cartão cadastrado.');
    }

    // 3. Gerar um número de cartão ÚNICO
    let numeroCartao: string;
    let numeroEmUso = true;
    
    // Loop de segurança contra colisão (extremamente raro, mas vital)
    while (numeroEmUso) {
        numeroCartao = generateCardNumber();
        const cartaoComNumero = await prisma.cartaoBeneficiario.findUnique({
        where: { numeroCartao },
        });
        // Se não encontrou (null), o número é único e o loop para
        if (!cartaoComNumero) {
        numeroEmUso = false;
        }
    }

    // 4. Gerar o CVV
    const codigoSeguranca = generateCVV();

    // 5. Calcular a data de validade (1 ano a partir de agora)
    const dataValidade = new Date(); // Pega a data/hora atual
    dataValidade.setFullYear(dataValidade.getFullYear() + 1); // Adiciona 1 ano

    // 6. Criar o cartão no banco
    return prisma.cartaoBeneficiario.create({
        data: {
        beneficiarioId: data.beneficiarioId,
        dataValidade: dataValidade,
        numeroCartao: numeroCartao!, // '!' pois o loop garante que será atribuído
        codigoSeguranca: codigoSeguranca,
        ativo: true, // O cartão é criado como 'ativo' por padrão
        },
    });
};

export const getAllCartoesService = async () => {
    return prisma.cartaoBeneficiario.findMany({
        include: {
        Beneficiario: { // Inclui o nome do beneficiário na listagem
            select: { nome: true }
        }
        }
    });
};

// Um método mais útil: buscar o cartão pelo ID do *Beneficiário*
export const getCartaoByBeneficiarioIdService = async (beneficiarioId: number) => {
    const cartao = await prisma.cartaoBeneficiario.findUnique({
        where: { beneficiarioId },
        include: {
        Beneficiario: {
            select: { nome: true, cpf: true }
        }
        }
    });

    if (!cartao) {
        throw new Error('Nenhum cartão encontrado para este beneficiário.');
    }
    return cartao;
};

// Rota dedicada para ativar/desativar o cartão
export const updateCartaoStatusService = async (id: number, ativo: boolean) => {
    const cartao = await prisma.cartaoBeneficiario.findUnique({ where: { id } });
    if (!cartao) {
        throw new Error('Cartão não encontrado.');
    }

    return prisma.cartaoBeneficiario.update({
        where: { id },
        data: { ativo },
    });
};

export const deleteCartaoService = async (id: number) => {
    const cartao = await prisma.cartaoBeneficiario.findUnique({ where: { id } });
    if (!cartao) {
        throw new Error('Cartão não encontrado.');
    }

    // A tabela CartaoBeneficiario não tem dependentes, pode ser deletada.
    return prisma.cartaoBeneficiario.delete({ where: { id } });
};