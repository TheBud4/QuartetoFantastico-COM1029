import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createDistribuicaoSchema } from '../validators/distribuicao.validator';
import {
  createDistribuicaoController,
  getAllDistribuicoesController,
  getDistribuicaoByIdController
} from '../controllers/distribuicao.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Distribuições
 *     description: "Endpoints para gerenciar a saída (distribuição) de itens para beneficiários."
 * components:
 *   schemas:
 *     ItemDistribuidoDetalhado:
 *       type: object
 *       properties:
 *         quantidade:
 *           type: integer
 *         item:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             tipo:
 *               type: object
 *               properties:
 *                 descricao:
 *                   type: string
 *                   example: "Camisa"
 *             tamanho:
 *               type: object
 *               properties:
 *                 descricao:
 *                   type: string
 *                   example: "M"
 *             condicao:
 *               type: object
 *               properties:
 *                 descricao:
 *                   type: string
 *                   example: "Novo"
 *
 *     DistribuicaoCompleta:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         dataCriacao:
 *           type: string
 *           format: date-time
 *         voluntario:
 *           type: object
 *           properties:
 *             nome:
 *               type: string
 *               example: "João Voluntário"
 *         beneficiario:
 *           type: object
 *           properties:
 *             nome:
 *               type: string
 *               example: "Maria Beneficiária"
 *         ItemDistribuicao:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemDistribuidoDetalhado'
 *
 *     NovaDistribuicaoInput:
 *       type: object
 *       required:
 *         - voluntarioId
 *         - beneficiarioId
 *         - itens
 *       properties:
 *         voluntarioId:
 *           type: integer
 *           example: 1
 *         beneficiarioId:
 *           type: integer
 *           example: 1
 *         itens:
 *           type: array
 *           items:
 *             type: object
 *             required: [itemId, quantidade]
 *             properties:
 *               itemId:
 *                 type: integer
 *                 example: 10
 *               quantidade:
 *                 type: integer
 *                 example: 2
 */

/**
 * @openapi
 * /distribuicoes:
 *   post:
 *     summary: Registra uma nova distribuição
 *     tags: [Distribuições]
 *     description: "Cria um novo registro de distribuição, vincula os itens e dá baixa no estoque. Esta é uma operação transacional: se o estoque de qualquer item for insuficiente, a operação inteira falha."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaDistribuicaoInput'
 *     responses:
 *       "201":
 *         description: "Distribuição registrada com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 voluntarioId:
 *                   type: integer
 *                 beneficiarioId:
 *                   type: integer
 *       "400":
 *         description: "Requisição inválida (ex: falta de estoque, item não encontrado, dados faltando)."
 *       "500":
 *         description: "Erro interno do servidor."
 */
router.post('/', validate(createDistribuicaoSchema), createDistribuicaoController);

/**
 * @openapi
 * /distribuicoes:
 *   get:
 *     summary: Lista todas as distribuições
 *     tags: [Distribuições]
 *     description: "Retorna um histórico de todas as distribuições, incluindo detalhes do voluntário, beneficiário e os itens distribuídos."
 *     responses:
 *       '200':
 *         description: Uma lista de distribuições.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DistribuicaoCompleta'
 *       '500':
 *         description: Erro ao buscar as distribuições.
 */
router.get('/', getAllDistribuicoesController);

/**
 * @openapi
 * /distribuicoes/{id}:
 *   get:
 *     summary: Busca uma distribuição por ID
 *     tags: [Distribuições]
 *     description: Retorna os detalhes completos de uma distribuição específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico da distribuição.
 *     responses:
 *       '200':
 *         description: Detalhes da distribuição.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DistribuicaoCompleta'
 *       '404':
 *         description: Distribuição não encontrada.
 *       '500':
 *         description: Erro ao buscar a distribuição.
 */
router.get('/:id', getDistribuicaoByIdController);

export default router;
