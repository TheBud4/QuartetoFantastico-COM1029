import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createDoacaoSchema } from '../validators/doacao.validator';
import { createDoacaoController } from '../controllers/doacao.controller';

const router = Router();

// TODO: Adicionar um middleware de autenticação para garantir que apenas
// usuários logados (voluntários/admins) possam registrar doações.

/**
 * @route GET /doacoes
 * @description Retorna todas as doações.
 * @access Público
 */
router.get('/', (req, res) => {
  //TODO: Implementar a lógica para buscar e retornar todas as doações do banco de dados.
  res.send('Rota de doações funcionando!');
});

/**
 * @route POST /doacoes
 * @description Cadastra uma nova doação.
 * @access Voluntários/Admins
 */
router.post(
  '/',
  validate(createDoacaoSchema), // 1º - Valida o corpo da requisição
  createDoacaoController        // 2º - Chama o controller se a validação passar
);

/**
 * @route GET /doacoes/:id
 * @description Retorna uma doação específica pelo ID.
 * @access Público
 */
router.get('/:id', (req, res) => {
  //TODO: Implementar a lógica para buscar e retornar uma doação específica pelo ID do banco de dados.
  const { id } = req.params;
  res.send(`Rota de doações funcionando para o ID: ${id}`);
});

/**
 * @route DELETE /doacoes/:id
 * @description Remove uma doação específica pelo ID.
 * @access Voluntários/Admins
 */
router.delete('/:id', (req, res) => {
  //TODO: Implementar a lógica para remover uma doação específica pelo ID do banco de dados.
  const { id } = req.params;
  res.send(`Rota de doações funcionando para a remoção do ID: ${id}`);
});

export default router;