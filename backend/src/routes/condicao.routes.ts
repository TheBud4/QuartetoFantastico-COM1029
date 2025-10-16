import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createCondicaoSchema } from '../validators/condicao.validator';
import { createCondicaoController, getAllCondicoesController, deleteCondicaoController, getCondicaoByIdController, updateCondicaoController } from '../controllers/condicao.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Condições
 *     description: "Endpoints para gerenciar as condições de conservação dos itens (ex: 'Novo', 'Usado', etc.)."
 * components:
 *   schemas:
 *     Condicao:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "O ID único da condição."
 *           example: 1
 *         descricao:
 *           type: string
 *           description: "A descrição da condição."
 *           example: "Novo, com etiqueta"
 */


/**
 * @openapi
 * /condicoes:
 *   get:
 *     summary: Lista todas as condições
 *     tags: [Condições]
 *     description: "Retorna uma lista de todas as condições de itens (ex: 'Novo', 'Usado - Bom estado') disponíveis para cadastro no sistema. Esta rota é ideal para popular menus de seleção (dropdowns) no frontend."
 *     responses:
 *       '200':
 *         description: Uma lista de condições foi retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Condicao'
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor ao tentar buscar os dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar as condições."
 */
router.get('/', getAllCondicoesController);

/**
 * @openapi
 * /condicoes/{id}:
 *   get:
 *     summary: Busca uma condição por ID
 *     tags: [Condições]
 *     description: Retorna os detalhes de uma condição específica com base no seu ID. É útil para preencher um formulário de edição, por exemplo.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico da condição a ser buscada.
 *     responses:
 *       '200':
 *         description: Detalhes da condição retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Condicao'
 *       '404':
 *         description: A condição com o ID especificado não foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Condição não encontrada."
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar a condição."
 */
router.get('/:id', getCondicaoByIdController);

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
 *               $ref: '#/components/schemas/Condicao'
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
 * /condicoes/{id}:
 *   put:
 *     summary: Atualiza uma condição existente
 *     tags: [Condições]
 *     description: Atualiza a descrição de uma condição específica com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico da condição a ser atualizada.
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
 *                 description: A nova descrição para a condição.
 *                 example: "Usado - Com pequenos detalhes"
 *     responses:
 *       '200':
 *         description: Condição atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Condicao'
 *       '400':
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
 *       '404':
 *         description: A condição com o ID especificado não foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Condição não encontrada."
 *       '409':
 *         description: Conflito. A nova descrição fornecida já está em uso por outra condição.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Esta condição já está cadastrada."
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao atualizar a condição."
 */
router.put('/:id', validate(createCondicaoSchema), updateCondicaoController);

/**
 * @openapi
 * /condicoes/{id}:
 *   delete:
 *     summary: Remove uma condição
 *     tags: [Condições]
 *     description: Remove uma condição do catálogo com base no seu ID. A operação falhará se a condição estiver em uso por um ou mais itens no estoque. Retornará 204 "No Content" em caso de sucesso.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico da condição a ser removida.
 *     responses:
 *       '204':
 *         description: Condição removida com sucesso. A resposta não contém corpo (No Content).
 *       '400':
 *         description: Requisição inválida. A condição não pode ser removida porque está em uso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Esta condição está em uso por um ou mais itens e não pode ser removida."
 *       '404':
 *         description: A condição com o ID especificado não foi encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Condição não encontrada."
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao deletar a condição."
 */
router.delete('/:id', deleteCondicaoController);

export default router;
