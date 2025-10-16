import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTipoSchema } from '../validators/tipo.validator';
import { createTipoController, getAllTiposController, getTipoByIdController, updateTipoController, deleteTipoController } from '../controllers/tipo.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Tipos
 *     description: "Endpoints para gerenciar os tipos de itens (ex: 'Roupa', 'Calçado', 'Brinquedo')."
 * components:
 *   schemas:
 *     Tipo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "O ID único do tipo."
 *           example: 1
 *         descricao:
 *           type: string
 *           description: "A descrição do tipo."
 *           example: "Roupa"
 */

/**
 * @openapi
 * /tipos:
 *   get:
 *     summary: Lista todos os tipos de itens
 *     tags: [Tipos]
 *     description: "Retorna uma lista de todos os tipos de itens (ex: 'Roupa', 'Calçado') disponíveis para cadastro no sistema. Esta rota é ideal para popular menus de seleção (dropdowns) no frontend."
 *     responses:
 *       '200':
 *         description: Lista de tipos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tipo'
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor ao tentar buscar os dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar os tipos."
 */
router.get('/', getAllTiposController);

/**
 * @openapi
 * /tipos/{id}:
 *   get:
 *     summary: Busca um tipo por ID
 *     tags: [Tipos]
 *     description: Retorna os detalhes de um tipo de item específico com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do tipo a ser buscado.
 *     responses:
 *       '200':
 *         description: Detalhes do tipo retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tipo'
 *       '404':
 *         description: O tipo com o ID especificado não foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo não encontrado."
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.get('/:id', getTipoByIdController);

/**
 * @openapi
 * /tipos:
 *   post:
 *     summary: Cria um novo tipo de item
 *     tags: [Tipos]
 *     description: "Adiciona um novo tipo de item ao catálogo (ex: 'Roupa', 'Calçado')."
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
 *                 description: A descrição única para o novo tipo.
 *                 example: "Brinquedo"
 *     responses:
 *       '201':
 *         description: Tipo criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tipo'
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
 *                       path: ["descricao"]
 *                       message: "A descrição é obrigatória."
 *               DescricaoMuitoCurta:
 *                 summary: "Erro quando a descrição é muito curta (ex: < 2 caracteres)"
 *                 value:
 *                   "Erro de Validação":
 *                     - code: "too_small"
 *                       type: "string"
 *                       minimum: 2
 *                       inclusive: true
 *                       path: ["descricao"]
 *                       message: "A descrição deve ter no mínimo 2 caracteres."
 *       '409':
 *         description: Conflito. Este tipo já existe no banco de dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este tipo já está cadastrado."
 *       '500':
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.post('/', validate(createTipoSchema), createTipoController);

/**
 * @openapi
 * /tipos/{id}:
 *   put:
 *     summary: Atualiza um tipo de item
 *     tags: [Tipos]
 *     description: Atualiza a descrição de um tipo de item existente, com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do tipo a ser atualizado.
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
 *                 description: A nova descrição para o tipo.
 *                 example: "Calçado Esportivo"
 *     responses:
 *       '200':
 *         description: Tipo atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tipo'
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
 *                       path: ["descricao"]
 *                       message: "A descrição é obrigatória."
 *               DescricaoMuitoCurta:
 *                 summary: "Erro quando a descrição é muito curta (ex: < 2 caracteres)"
 *                 value:
 *                   "Erro de Validação":
 *                     - code: "too_small"
 *                       type: "string"
 *                       minimum: 2
 *                       inclusive: true
 *                       path: ["descricao"]
 *                       message: "A descrição deve ter no mínimo 2 caracteres."
 *       '404':
 *         description: O tipo com o ID especificado não foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo não encontrado."
 *       '409':
 *         description: Conflito. A nova descrição fornecida já está em uso por outro tipo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Esta descrição já está em uso por outro tipo."
 *       '500':
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.put('/:id', validate(createTipoSchema), updateTipoController);

/**
 * @openapi
 * /tipos/{id}:
 *   delete:
 *     summary: Remove um tipo de item
 *     tags: [Tipos]
 *     description: Remove um tipo do catálogo com base no seu ID. A operação falhará se o tipo estiver em uso por um ou mais tamanhos ou itens no estoque. Retornará 204 "No Content" em caso de sucesso.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do tipo a ser removido.
 *     responses:
 *       '204':
 *         description: Tipo removido com sucesso. A resposta não contém corpo (No Content).
 *       '400':
 *         description: Requisição inválida. O tipo não pode ser removido porque está em uso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este tipo está em uso por um ou mais tamanhos e não pode ser removido."
 *       '404':
 *         description: O tipo com o ID especificado não foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tipo não encontrado."
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro interno do servidor."
 */
router.delete('/:id', deleteTipoController);

export default router;