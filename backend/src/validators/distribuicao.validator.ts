import { z } from 'zod';

// Schema para um item individual dentro da distribuição
const itemDistribuicaoSchema = z.object({
    itemId: z.number({ error: issue => issue.input === undefined ? 'O ID do item é obrigatório.' : 'O ID do item deve ser numérico.' })
        .int({ message: 'O ID do item deve ser um inteiro.' })
        .positive('O ID do item é inválido.'),
    quantidade: z.number({ error: issue => issue.input === undefined ? 'A quantidade é obrigatória.' : 'A quantidade deve ser numérica.' })
        .int({ message: 'A quantidade deve ser um inteiro.' })
        .positive('A quantidade deve ser de pelo menos 1.'),
});

// Schema principal para criar uma nova distribuição
export const createDistribuicaoSchema = z.object({
    voluntarioId: z.number({ error: issue => issue.input === undefined ? 'O ID do voluntário é obrigatório.' : 'O ID do voluntário deve ser numérico.' })
        .int({ message: 'O ID do voluntário deve ser um inteiro.' }),

    beneficiarioId: z.number({ error: issue => issue.input === undefined ? 'O ID do beneficiário é obrigatório.' : 'O ID do beneficiário deve ser numérico.' })
        .int({ message: 'O ID do beneficiário deve ser um inteiro.' }),

    itens: z.array(itemDistribuicaoSchema)
        .min(1, 'A distribuição deve conter pelo menos um item.'),
});

export type CreateDistribuicaoSchemaType = z.infer<typeof createDistribuicaoSchema>;
