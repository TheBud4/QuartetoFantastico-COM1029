import { Request, Response } from 'express';
import { getMovimentacoesService } from '../services/relatorio.service';

export const getMovimentacoesController = async (req: Request, res: Response) => {
  try {
    const { inicio, fim } = req.query;

    const inicioDate = inicio ? new Date(String(inicio)) : undefined;
    const fimDate = fim ? new Date(String(fim)) : undefined;

    if (inicioDate && isNaN(inicioDate.getTime())) {
      return res.status(400).json({ message: 'Parâmetro "inicio" inválido.' });
    }
    if (fimDate && isNaN(fimDate.getTime())) {
      return res.status(400).json({ message: 'Parâmetro "fim" inválido.' });
    }

    const data = await getMovimentacoesService(inicioDate, fimDate);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao gerar relatório de movimentações.' });
  }
};
