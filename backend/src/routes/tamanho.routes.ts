import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTamanhoSchema } from '../validators/tamanho.validator';
import { createTamanhoController, getAllTamanhosController } from '../controllers/tamanho.controller';

const router = Router();
// TODO: Adicionar middleware de autorização para garantir que apenas Admins ou Voluntários possam criar

/**
 * @openapi
 * tags:
 *   - name: Tamanhos
 *     description: "Endpoints para gerenciar os tamanhos dos itens (P, M, G, etc.)."
*/

/**
 * @access Voluntários/Admins
 * @note O filtro por tipoId é opcional. Se não for fornecido, todos os tamanhos serão retornados.
 * @query {number} tipoId - (Opcional) ID do tipo para filtrar os tamanhos.
 * @example /tamanhos?tipoId=1
 * @example /tamanhos
 */

/**
 * @openapi
 * /tamanhos:
 *   get:
 *     summary: Lista todos os tamanhos
 *     tags: [Tamanhos]
 *     description: "Retorna uma lista de todos os tamanhos de itens disponíveis para cadastro no sistema, podendo ser filtrado por tipo. Esta rota é usada para popular formulários no frontend."
 *     responses:
 *       "200":
 *         description: "Lista de tamanhos retornada com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   descricao:
 *                     type: string
 *                     example: "Novo, com etiqueta"
 *       "500":
 *         description: "Erro interno do servidor."
*/
router.get('/', getAllTamanhosController); // O filtro é feito pelo controller


/**
 * @route POST /tamanhos
 * @description Cadastra um novo tamanho.
 * @access Voluntários/Admins
 */
router.post('/', validate(createTamanhoSchema), createTamanhoController);

export default router;