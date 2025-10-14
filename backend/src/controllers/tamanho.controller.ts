import { Request, Response } from 'express';
import { createTamanhoService, getAllTamanhosService } from '../services/tamanho.service';

export const createTamanhoController = async (req: Request, res: Response) => {
  try {
    const { descricao, tipoId } = req.body;
    const novoTamanho = await createTamanhoService(descricao, tipoId);
    return res.status(201).json(novoTamanho);
  } catch (error: any) {
    if (error.message.includes('já está cadastrado')) {
      return res.status(409).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getAllTamanhosController = async (req: Request, res: Response) => {
  try {
    const tipoIdQuery = req.query.tipoId;
    const tipoId = tipoIdQuery ? parseInt(tipoIdQuery as string) : undefined;

    const tamanhos = await getAllTamanhosService(tipoId);
    return res.status(200).json(tamanhos);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar os tamanhos.' });
  }
};