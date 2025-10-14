import { z } from 'zod';

export const createTamanhoSchema = z.object({
    descricao: z.string('A descrição é obrigatória.'),
    tipoId: z.number('O ID do tipo é obrigatório.'),
});