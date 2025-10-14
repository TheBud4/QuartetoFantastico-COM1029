import { Request, Response } from 'express';
import { createCondicaoService, getAllCondicoesService } from '../services/condicao.service';

export const createCondicaoController = async (req: Request, res: Response) => {
  try {
    const { descricao } = req.body;
    const novaCondicao = await createCondicaoService(descricao);
    return res.status(201).json(novaCondicao);
  } catch (error: any) {
    if (error.message.includes('já está cadastrada')) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getAllCondicoesController = async (req: Request, res: Response) => {
  try {
    const condicoes = await getAllCondicoesService();
    return res.status(200).json(condicoes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar as condições.' });
  }
};