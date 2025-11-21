import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Formato de email inválido ou não informado.'),
  senha: z.string('A senha é obrigatória.'),
});
