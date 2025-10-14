import { Router } from 'express';
import { validate } from '../middlewares/validator.middleware';
import { createDoacaoSchema } from '../validators/doacao.validator';
import { createDoacaoController } from '../controllers/doacao.controller';

const router = Router();

// TODO: Adicionar um middleware de autenticação para garantir que apenas
// usuários logados (voluntários/admins) possam registrar doações.

router.post(
  '/',
  validate(createDoacaoSchema), // 1º - Valida o corpo da requisição
  createDoacaoController        // 2º - Chama o controller se a validação passar
);

export default router;