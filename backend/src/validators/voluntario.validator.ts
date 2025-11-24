import { z } from 'zod';

export const createVoluntarioSchema = z.object({
    nome: z.string('O nome é obrigatório.').min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z.string('O email é obrigatório.').email('Formato de email inválido.'),
    // A senha é obrigatória na criação
    senha: z.string('A senha é obrigatória.').min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    admin: z.boolean().optional().default(false), // Se não enviar, assume false (Voluntário comum)
    endereco: z.string().optional(),
    telefone: z.string().optional(),
});

export const updateVoluntarioSchema = z.object({
    nome: z.string().min(3).optional(),
    email: z.email('Formato de email inválido.').optional(),
    // A senha é opcional na atualização. Se enviada, será trocada.
    senha: z.string().min(6).optional(),
    admin: z.boolean().optional(),
    endereco: z.string().optional(),
    telefone: z.string().optional(),
});

export type CreateVoluntarioInput = z.infer<typeof createVoluntarioSchema>;
export type UpdateVoluntarioInput = z.infer<typeof updateVoluntarioSchema>;