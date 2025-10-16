import { Request, Response } from 'express';
import { createDoacaoService } from '../services/doacao.service';

export const createDoacaoController = async (req: Request, res: Response) => {
  try {
    const doacao = await createDoacaoService(req.body);
    return res.status(201).json(doacao);
  } catch (error) {
    // Trata erros, como um voluntarioId que não existe
    return res.status(400).json({ message: 'Não foi possível registrar a doação. Verifique os dados enviados.' });
  }
};