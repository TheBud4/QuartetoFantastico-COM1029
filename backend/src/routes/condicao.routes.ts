import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createCondicaoSchema } from '../validators/condicao.validator';
import { createCondicaoController, getAllCondicoesController } from '../controllers/condicao.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Condições
 *     description: "Endpoints para gerenciar as condições de conservação dos itens (Novo, Usado, etc.)."
*/


/**
 * @openapi
 * /condicoes:
 *   get:
 *     summary: Lista todas as condições
 *     tags: [Condições]
 *     description: "Retorna uma lista de todas as condições de itens disponíveis para cadastro no sistema. Esta rota é usada para popular formulários no frontend."
 *     responses:
 *       "200":
 *         description: "Lista de condições retornada com sucesso."
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
router.get('/', getAllCondicoesController);

/**
 * @openapi
 * /condicoes:
 *   post:
 *     summary: Cria uma nova condição
 *     tags: [Condições]
 *     description: "Adiciona uma nova condição de item ao catálogo."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: "A descrição única para a nova condição."
 *                 example: "Usado - Necessita reparos"
 *     responses:
 *       "201":
 *         description: "Condição criada com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 descricao:
 *                   type: string
 *                   example: "Usado - Necessita reparos"
 *       "400":
 *         description: "Requisição inválida. O corpo da requisição não atende aos critérios de validação."
 *         content:
 *           application/json:
 *             examples:
 *               DescricaoAusente:
 *                 summary: "Erro quando a descrição não é enviada"
 *                 value:
 *                   "Erro de Validação":
 *                     - code: "invalid_type"
 *                       expected: "string"
 *                       received: "undefined"
 *                       path:
 *                         - "descricao"
 *                       message: "A descrição é obrigatória."
 *               DescricaoMuitoCurta:
 *                 summary: "Erro quando a descrição é muito curta"
 *                 value:
 *                   "Erro de Validação":
 *                     - code: "too_small"
 *                       type: "string"
 *                       minimum: 2
 *                       inclusive: true
 *                       path:
 *                         - "descricao"
 *                       message: "A descrição deve ter no mínimo 2 caracteres."
 *       "409":
 *         description: "Conflito. A condição com essa descrição já existe."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Esta condição já está cadastrada."
 *       "500":
 *         description: "Erro interno do servidor."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.post('/', validate(createCondicaoSchema), createCondicaoController);

/**
 * @openapi
 * /condicoes:
 *   put:
 *    summary: Ainda não implementado
 *    tags: [Condições]
 *    description: "Rota reservada para futuras implementações."
 *    responses:
 *      "501":
 *        description: "Não implementado."
 */
router.put('/', (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
});
/**
 * @openapi
 * /condicoes:
 *   delete:
 *    summary: Ainda não implementado
 *    tags: [Condições]
 *    description: "Rota reservada para futuras implementações."
 *    responses:
 *      "501":
 *        description: "Não implementado."
 */
router.delete('/', (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
});

export default router;