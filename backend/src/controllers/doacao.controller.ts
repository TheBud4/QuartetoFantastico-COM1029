import { Request, Response } from 'express';
import { createDoacaoService, deleteDoacaoService, getAllDoacoesService, getDoacaoByIdService } from '../services/doacao.service';

export const createDoacaoController = async (req: Request, res: Response) => {
  try {
    const doacao = await createDoacaoService(req.body);
    return res.status(201).json(doacao);
  } catch (error) {
    if (error instanceof Error && error.message === 'Voluntário não encontrado.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ message: 'Não foi possível registrar a doação. Verifique os dados enviados.' });
  }
};

export const getAllDoacoesController = async (req: Request, res: Response) => {
  try {
    const doacoes = await getAllDoacoesService();
    return res.status(200).json(doacoes);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar doações.' });
  }
};

export const getDoacaoByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const doacao = await getDoacaoByIdService(id);
    return res.status(200).json(doacao);
  } catch (error: any) {
    if (error.message === 'Doação não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Erro interno.' });
  }
};

export const deleteDoacaoController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await deleteDoacaoService(id);
    return res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Doação não encontrada.') {
      return res.status(404).json({ message: error.message });
    }
    // Pode ocorrer erro se tentar decrementar estoque abaixo de zero (P2025)
    return res.status(500).json({ message: 'Erro ao cancelar doação.' });
  }
};
