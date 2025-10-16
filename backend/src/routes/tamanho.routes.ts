import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTamanhoSchema } from '../validators/tamanho.validator';
import { createTamanhoController, getAllTamanhosController, getTamanhoByIdController, updateTamanhoController, deleteTamanhoController } from '../controllers/tamanho.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Tamanhos
 *     description: "Endpoints para gerenciar os tamanhos dos itens (ex: 'G', '42'), que são sempre vinculados a um Tipo."
 * components:
 *   schemas:
 *     Tamanho:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "O ID do tamanho."
 *           example: 1
 *         descricao:
 *           type: string
 *           description: "A descrição do tamanho."
 *           example: "G"
 *         tipoId:
 *           type: integer
 *           description: "O ID do Tipo ao qual este tamanho pertence."
 *           example: 1
 */


/**
 * @openapi
 * /tamanhos:
 *   get:
 *     summary: Lista todos os tamanhos
 *     tags: [Tamanhos]
 *     description: Retorna uma lista de todos os tamanhos cadastrados. Esta rota permite um filtro opcional por 'tipoId' para popular formulários de forma dinâmica.
 *     parameters:
 *       - in: query
 *         name: tipoId
 *         schema:
 *           type: integer
 *         description: (Opcional) Filtra a lista para retornar apenas tamanhos que pertencem a um tipo específico.
 *         example: 1
 *     responses:
 *       '200':
 *         description: Lista de tamanhos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tamanho'
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor ao tentar buscar os dados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar os tamanhos."
 */
router.get('/', getAllTamanhosController); // O filtro é feito pelo controller

/**
 * @openapi
 * /tamanhos/{id}:
 *   get:
 *     summary: Busca um tamanho por ID
 *     tags: [Tamanhos]
 *     description: "Retorna os detalhes de um tamanho específico com base no seu ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "O ID numérico do tamanho a ser buscado."
 *     responses:
 *       '200':
 *         description: "Detalhes do tamanho retornados com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tamanho'
 *       '404':
 *         description: "O tamanho com o ID especificado não foi encontrado."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tamanho não encontrado."
 *       '500':
 *         description: "Ocorreu um erro inesperado no servidor."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar o tamanho."
 */
router.get('/:id', getTamanhoByIdController);
/**
 * @openapi
 * /tamanhos:
 *   post:
 *     summary: Cria um novo tamanho
 *     tags: [Tamanhos]
 *     description: "Adiciona um novo tamanho a um tipo de item existente (ex: 'G' para 'Roupas')."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - tipoId
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: A descrição para o novo tamanho.
 *                 example: "42"
 *               tipoId:
 *                 type: integer
 *                 description: O ID do 'Tipo' ao qual este tamanho está associado.
 *                 example: 2
 *     responses:
 *       '201':
 *         description: Tamanho criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tamanho'
 *       '400':
 *         description: "Requisição inválida. O corpo da requisição não atende aos critérios de validação ou lógicos."
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
 *               TipoIdAusente:
 *                 summary: "Erro quando o tipoId não é enviado"
 *                 value:
 *                   "Erro de Validação":
 *                     - code: "invalid_type"
 *                       expected: "number"
 *                       received: "undefined"
 *                       path: ["tipoId"]
 *                       message: "O ID do tipo é obrigatório."
 *               TipoNaoEncontrado:
 *                 summary: "Erro quando o tipoId enviado não existe"
 *                 value:
 *                   message: "Tipo não encontrado."
 *       '409':
 *         description: Conflito. Este tamanho já existe para o tipo especificado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este tamanho já está cadastrado para este tipo."
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
router.post('/', validate(createTamanhoSchema), createTamanhoController);

/**
 * @openapi
 * /tamanhos/{id}:
 *   put:
 *     summary: Atualiza um tamanho existente
 *     tags: [Tamanhos]
 *     description: Atualiza a descrição e/ou o tipo de um tamanho específico, com base no seu ID. Requer perfil de Administrador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do tamanho a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - tipoId
 *             properties:
 *               descricao:
 *                 type: string
 *                 description: A nova descrição para o tamanho.
 *                 example: "GG"
 *               tipoId:
 *                 type: integer
 *                 description: O ID do 'Tipo' ao qual este tamanho está associado.
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Tamanho atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tamanho'
 *       '400':
 *         description: "Requisição inválida. O corpo da requisição não atende aos critérios de validação ou lógicos."
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
 *               TipoIdAusente:
 *                 summary: "Erro quando o tipoId não é enviado"
 *                 value:
 *                   "Erro de Validação":
 *                     - code: "invalid_type"
 *                       expected: "number"
 *                       received: "undefined"
 *                       path: ["tipoId"]
 *                       message: "O ID do tipo é obrigatório."
 *               TipoNaoEncontrado:
 *                 summary: "Erro quando o tipoId enviado não existe"
 *                 value:
 *                   message: "Tipo não encontrado."
 *       '404':
 *         description: O tamanho com o ID especificado não foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tamanho não encontrado."
 *       '409':
 *         description: Conflito. A nova combinação de descrição e tipoId já está em uso por outro tamanho.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este tamanho já está cadastrado para este tipo."
 *       '500':
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao atualizar o tamanho."
 */
router.put('/:id', validate(createTamanhoSchema), updateTamanhoController);

/**
 * @openapi
 * /tamanhos/{id}:
 *   delete:
 *     summary: Remove um tamanho
 *     tags: [Tamanhos]
 *     description: Remove um tamanho do catálogo com base no seu ID. A operação falhará se o tamanho estiver em uso por um ou mais itens no estoque. Retornará 204 "No Content" em caso de sucesso.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do tamanho a ser removido.
 *     responses:
 *       '204':
 *         description: Tamanho removido com sucesso. A resposta não contém corpo (No Content).
 *       '400':
 *         description: Requisição inválida. O tamanho não pode ser removido porque está em uso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Este tamanho está em uso por um ou mais itens e não pode ser removido."
 *       '404':
 *         description: O tamanho com o ID especificado não foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tamanho não encontrado."
 *       '500':
 *         description: Ocorreu um erro inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao deletar o tamanho."
 */
router.delete('/:id', deleteTamanhoController);

export default router;