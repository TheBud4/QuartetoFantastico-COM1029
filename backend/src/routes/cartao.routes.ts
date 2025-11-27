import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createCartaoSchema, updateCartaoStatusSchema } from '../validators/cartao.validator';
import {
  createCartaoController,
  getAllCartoesController,
  getCartaoByBeneficiarioIdController,
  updateCartaoStatusController,
  deleteCartaoController,
} from '../controllers/cartao.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Cartões de Beneficiário
 *     description: "Endpoints para gerenciar os cartões de identificação dos beneficiários."
 * components:
 *   schemas:
 *     CartaoBeneficiario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "O ID único do cartão."
 *           example: 1
 *         numeroCartao:
 *           type: string
 *           description: "Número de 16 dígitos do cartão."
 *           example: "1234567890123456"
 *         dataValidade:
 *           type: string
 *           format: date-time
 *           description: "Data de validade do cartão."
 *         codigoSeguranca:
 *           type: string
 *           description: "CVV de 3 dígitos."
 *           example: "123"
 *         ativo:
 *           type: boolean
 *           description: "Indica se o cartão está ativo."
 *           example: true
 *         beneficiarioId:
 *           type: integer
 *           description: "ID do beneficiário ao qual o cartão pertence."
 *           example: 1
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *           description: "Data de criação do registro."
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: "Data da última atualização do registro."
 *     CartaoComBeneficiario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         numeroCartao:
 *           type: string
 *         ativo:
 *           type: boolean
 *         beneficiario:
 *           type: object
 *           properties:
 *             nome:
 *               type: string
 *               example: "Maria da Silva"
 *             cpf:
 *               type: string
 *               example: "12345678901"
 */

/**
 * @openapi
 * /cartoes:
 *   post:
 *     summary: Cria um novo cartão para um beneficiário
 *     tags: [Cartões de Beneficiário]
 *     description: "Cria um novo cartão e o vincula a um beneficiário. O número do cartão (16 dígitos), o CVV (3 dígitos) e a data de validade (1 ano) são gerados automaticamente pelo servidor. Falhará se o beneficiário já tiver um cartão (regra 1:1)."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - beneficiarioId
 *             properties:
 *               beneficiarioId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       "201":
 *         description: "Cartão criado e vinculado com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartaoBeneficiario'
 *       "400":
 *         description: "Requisição inválida (ex: ID do beneficiário ausente)."
 *       "404":
 *         description: "Beneficiário não encontrado."
 *       "409":
 *         description: "Conflito. O beneficiário já possui um cartão."
 */
router.post('/', validate(createCartaoSchema), createCartaoController);

/**
 * @openapi
 * /cartoes:
 *   get:
 *     summary: Lista todos os cartões cadastrados
 *     tags: [Cartões de Beneficiário]
 *     description: "Retorna uma lista de todos os cartões, incluindo o nome do beneficiário associado."
 *     responses:
 *       '200':
 *         description: Uma lista de cartões.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   numeroCartao:
 *                     type: string
 *                   ativo:
 *                     type: boolean
 *                   beneficiario:
 *                     type: object
 *                     properties:
 *                       nome:
 *                         type: string
 *                         example: "Jose da Silva"
 *       '500':
 *         description: Erro ao buscar os cartões.
 */
router.get('/', getAllCartoesController);

/**
 * @openapi
 * /cartoes/beneficiario/{beneficiarioId}:
 *   get:
 *     summary: Busca o cartão de um beneficiário específico
 *     tags: [Cartões de Beneficiário]
 *     description: Retorna os detalhes do cartão vinculado a um ID de beneficiário específico.
 *     parameters:
 *       - in: path
 *         name: beneficiarioId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do beneficiário.
 *     responses:
 *       '200':
 *         description: Detalhes do cartão.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartaoComBeneficiario'
 *       '404':
 *         description: Nenhum cartão encontrado para este beneficiário.
 */
router.get('/beneficiario/:beneficiarioId', getCartaoByBeneficiarioIdController);

/**
 * @openapi
 * /cartoes/{id}/status:
 *   patch:
 *     summary: Ativa ou desativa um cartão
 *     tags: [Cartões de Beneficiário]
 *     description: Atualiza o status (ativo/inativo) de um cartão específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do *cartão*.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ativo
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       '200':
 *         description: Status do cartão atualizado com sucesso.
 *       '400':
 *         description: "Requisição inválida (body mal formatado)."
 *       '404':
 *         description: Cartão não encontrado.
 */
router.patch('/:id/status', validate(updateCartaoStatusSchema), updateCartaoStatusController);

/**
 * @openapi
 * /cartoes/{id}:
 *   delete:
 *     summary: Remove um cartão
 *     tags: [Cartões de Beneficiário]
 *     description: Remove um cartão do sistema com base no ID do cartão.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do *cartão* a ser removido.
 *     responses:
 *       '204':
 *         description: Cartão removido com sucesso (Sem conteúdo).
 *       '404':
 *         description: Cartão não encontrado.
 */
router.delete('/:id', deleteCartaoController);

export default router;
