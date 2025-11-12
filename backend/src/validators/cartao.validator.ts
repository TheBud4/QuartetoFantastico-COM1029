import { z } from 'zod';

// Schema para criação (só precisa do ID do beneficiário)
export const createCartaoSchema = z.object({
    beneficiarioId: z.number({
        required_error: 'O ID do beneficiário é obrigatório.',
        invalid_type_error: 'O ID do beneficiário deve ser um número.',
    }).int().positive('O ID do beneficiário deve ser um número positivo.'),
});

// Schema para uma rota PATCH dedicada a mudar o status
export const updateCartaoStatusSchema = z.object({
    ativo: z.boolean({
        required_error: 'O status (ativo/inativo) é obrigatório.',
        invalid_type_error: 'O status deve ser um valor booleano (true/false).',
    }),
});

export type CreateCartaoSchemaType = z.infer<typeof createCartaoSchema>;