
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

// Interface para o payload do JWT que definimos no service
interface JwtPayload {
    id: number;
    email: string;
    admin: boolean;
}

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    // O token vem no formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token mal formatado.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: 'Segredo JWT não configurado.' });
    }

    try {
        // Verifica se o token é válido
        const decoded = jwt.verify(token, secret) as JwtPayload;

        // Anexa os dados do usuário à requisição para uso posterior nos controllers
        (req as any).user = decoded; // Forma rápida

        // (Forma ideal com TypeScript - requer um ficheiro de tipos, ver abaixo)
        req.user = decoded;

        next(); // Permite que a requisição continue
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};