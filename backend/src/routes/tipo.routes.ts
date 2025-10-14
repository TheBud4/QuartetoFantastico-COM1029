import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTipoSchema } from '../validators/tipo.validator';
import { createTipoController, getAllTiposController } from '../controllers/tipo.controller';

const router = Router();

// TODO: Adicionar middleware de autorização para garantir que apenas Admins ou Voluntários possam criar

/**
 * @route POST /tipos
 * @description Cadastra um novo tipo.
 * @access Voluntários/Admins
 */
router.post('/', validate(createTipoSchema), createTipoController);

/**
 * @route GET /tipos
 * @description Retorna todos os tipos.
 * @access Público
 */
router.get('/', getAllTiposController);

export default router;