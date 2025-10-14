import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createCondicaoSchema } from '../validators/condicao.validator';
import { createCondicaoController, getAllCondicoesController } from '../controllers/condicao.controller';

const router = Router();

// TODO: Adicionar middleware de autorização para garantir que apenas Admins ou Voluntários possam criar

/**
 * @route POST /condicoes
 * @description Cadastra uma nova condição.
 * @access Voluntários/Admins
 */
router.post('/', validate(createCondicaoSchema), createCondicaoController);

/**
 * @route GET /condicoes
 * @description Retorna todas as condições.
 * @access Público
 */
router.get('/', getAllCondicoesController);

export default router;