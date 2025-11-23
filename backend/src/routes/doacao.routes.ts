import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createDoacaoSchema } from '../validators/doacao.validator';
import { createDoacaoController } from '../controllers/doacao.controller';

const router = Router();

router.get('/', (req, res) => {
  //TODO: Implementar a lógica para buscar e retornar todas as doações do banco de dados.
  res.send('Rota de doações funcionando!');
});

router.post(
  '/',
  validate(createDoacaoSchema), // 1º - Valida o corpo da requisição
  createDoacaoController        // 2º - Chama o controller se a validação passar
);

router.get('/:id', (req, res) => {
  //TODO: Implementar a lógica para buscar e retornar uma doação específica pelo ID do banco de dados.
  const { id } = req.params;
  res.send(`Rota de doações funcionando para o ID: ${id}`);
});

router.delete('/:id', (req, res) => {
  //TODO: Implementar a lógica para remover uma doação específica pelo ID do banco de dados.
  const { id } = req.params;
  res.send(`Rota de doações funcionando para a remoção do ID: ${id}`);
});

export default router;
