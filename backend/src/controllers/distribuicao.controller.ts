import { Request, Response } from 'express';
import {
    createDistribuicaoService,
    getAllDistribuicoesService,
    getDistribuicaoByIdService
} from '../services/distribuicao.service';

export const createDistribuicaoController = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const novaDistribuicao = await createDistribuicaoService(data);
        return res.status(201).json(novaDistribuicao);
    } catch (error: any) {
        // Erros de negócio (falta de estoque, item não encontrado)
        if (error.message.includes('Estoque insuficiente') || 
            error.message.includes('não encontrado')) {
        return res.status(400).json({ message: error.message }); // 400 Bad Request
        }
        // Erro genérico
        return res.status(500).json({ message: 'Erro interno do servidor ao criar a distribuição.' });
    }
};

export const getAllDistribuicoesController = async (req: Request, res: Response) => {
    try {
        const distribuicoes = await getAllDistribuicoesService();
        return res.status(200).json(distribuicoes);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar as distribuições.' });
    }
};

export const getDistribuicaoByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const distribuicao = await getDistribuicaoByIdService(Number(id));
        return res.status(200).json(distribuicao);
    } catch (error: any) {
        if (error.message.includes('não encontrada')) {
        return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Erro ao buscar a distribuição.' });
    }
};