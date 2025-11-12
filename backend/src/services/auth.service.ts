import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { loginSchema } from '../validators/auth.validator';
import { z } from 'zod';

// Extrai o tipo de dado de entrada a partir do schema do Zod
type LoginInput = z.infer<typeof loginSchema>['body'];

export const loginService = async (input: LoginInput) => {
    const { email, senha } = input;

    // 1. Encontrar o usuário pelo email (no nosso caso, é um Voluntario)
    const voluntario = await prisma.voluntario.findUnique({
        where: { email },
    });

    // 2. Se o usuário não existir, lançar um erro.
    // Nota de Segurança: Usamos uma mensagem genérica para não informar ao atacante se o email existe ou não.
    if (!voluntario) {
        throw new Error('Credenciais inválidas.');
    }

    // 3. Comparar a senha enviada com o hash armazenado no banco
    const senhaValida = await bcrypt.compare(senha, voluntario.senha);

    // 4. Se a senha for inválida, lançar o mesmo erro genérico.
    if (!senhaValida) {
        throw new Error('Credenciais inválidas.');
    }

    // 5. Gerar o token JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('Segredo JWT не está configurado.');
    }

    const token = jwt.sign(
        {
            id: voluntario.id,
            email: voluntario.email,
            admin: voluntario.admin, // Incluímos o perfil no token
        },
        secret,
        { expiresIn: '8h' } // Define o tempo de expiração do token (ex: 8 horas)
    );

    // 6. Retornar o token e os dados do usuário (sem a senha)
    const { senha: _, ...voluntarioSemSenha } = voluntario;

    return {
        voluntario: voluntarioSemSenha,
        token: token,
    };
};