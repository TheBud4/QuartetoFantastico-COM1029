import { Request, Response } from 'express';
import { createTipoService, getAllTiposService } from '../services/tipo.service';

export const createTipoController = async (req: Request, res: Response) => {
  try {
    const { descricao } = req.body;
    const novoTipo = await createTipoService(descricao);
    return res.status(201).json(novoTipo);
  } catch (error: any) {
    if (error.message.includes('já está cadastrado')) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getAllTiposController = async (req: Request, res: Response) => {
  try {
    const tipos = await getAllTiposService();
    return res.status(200).json(tipos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar os tipos.' });
  }
};