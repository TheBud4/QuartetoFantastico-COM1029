import { z } from 'zod';

export const createCondicaoSchema = z.object({
    descricao: z.string('A descrição é obrigatória.').min(2, 'A descrição deve ter no mínimo 2 caracteres.'),
});