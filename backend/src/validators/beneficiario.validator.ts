import { z } from 'zod';

// Schema para criação e atualização de Beneficiário
export const beneficiarioSchema = z.object({
    nome: z.string({ required_error: 'O nome é obrigatório.' })
        .min(3, 'O nome deve ter no mínimo 3 caracteres.'),
        
    cpf: z.string({ required_error: 'O CPF é obrigatório.' })
        .regex(/^\d{11}$/, 'O CPF deve conter exatamente 11 dígitos numéricos.'),

    telefone: z.string()
        .regex(/^\d{10,11}$/, 'O Telefone deve conter 10 ou 11 dígitos numéricos (DDD + número).')
        .optional()
        .nullable(),
    
    endereco: z.string()
        .min(5, 'O endereço deve ter no mínimo 5 caracteres.')
        .optional()
        .nullable(),
});

// Tipo inferido para uso nos serviços
export type BeneficiarioSchemaType = z.infer<typeof beneficiarioSchema>;