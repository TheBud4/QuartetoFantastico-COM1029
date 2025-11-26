import { z } from 'zod';

// Schema para um item individual dentro da distribuição
const itemDistribuicaoSchema = z.object({
    itemId: z.number().int().positive('O ID do item é inválido.'),
    quantidade: z.number().int().positive('A quantidade deve ser de pelo menos 1.'),
});

// Schema principal para criar uma nova distribuição
export const createDistribuicaoSchema = z.object({
    voluntarioId: z.number().int().positive('O ID do voluntário é obrigatório.'),
    
    beneficiarioId: z.number().int().positive('O ID do beneficiário é obrigatório.'),

    itens: z.array(itemDistribuicaoSchema)
    .min(1, 'A distribuição deve conter pelo menos um item.'),
});

export type CreateDistribuicaoSchemaType = z.infer<typeof createDistribuicaoSchema>;