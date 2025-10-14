import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTamanhoSchema } from '../validators/tamanho.validator';
import { createTamanhoController, getAllTamanhosController } from '../controllers/tamanho.controller';

const router = Router();
// TODO: Adicionar middleware de autorização para garantir que apenas Admins ou Voluntários possam criar

/**
 * @route POST /tamanhos
 * @description Cadastra um novo tamanho.
 * @access Voluntários/Admins
 */
router.post('/', validate(createTamanhoSchema), createTamanhoController);

/**
 * @route GET /tamanhos
 * @description Retorna todos os tamanhos. Pode filtrar por tipoId.
 * @access Voluntários/Admins
 * @note O filtro por tipoId é opcional. Se não for fornecido, todos os tamanhos serão retornados.
 * @query {number} tipoId - (Opcional) ID do tipo para filtrar os tamanhos.
 * @example /tamanhos?tipoId=1
 * @example /tamanhos
 */
router.get('/', getAllTamanhosController); // O filtro é feito pelo controller

export default router;