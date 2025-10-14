import { z } from 'zod';

// Schema para cada item individual na lista de doação
const itemSchema = z.object({
  tipo: z.string('O tipo do item é obrigatório.'),
  descricao: z.string('A descrição do item é obrigatória.'),
  tamanho: z.string('O tamanho do item é obrigatório.'),
  quantidade: z.number('A quantidade é obrigatória.').positive('A quantidade deve ser maior que zero.'),
});

// Schema principal para o corpo da requisição de criação de doação
export const createDoacaoSchema = z.object({
    voluntarioId: z.number('O ID do voluntário é obrigatório.'),
    itens: z.array(itemSchema).min(1, 'A doação deve conter pelo menos um item.'),
});