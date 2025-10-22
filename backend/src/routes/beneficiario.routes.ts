import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { beneficiarioSchema } from '../validators/beneficiario.validator';
import {
    createBeneficiarioController,
    getAllBeneficiariosController,
    getBeneficiarioByIdController,
    updateBeneficiarioController,
    deleteBeneficiarioController
} from '../controllers/beneficiario.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Beneficiários
 *     description: "Endpoints para gerenciar os beneficiários."
 * components:
 *   schemas:
 *     Beneficiario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "O ID único do beneficiário."
 *           example: 1
 *         nome:
 *           type: string
 *           description: "Nome completo do beneficiário."
 *           example: "Maria da Silva"
 *         cpf:
 *           type: string
 *           description: "CPF do beneficiário (11 dígitos)."
 *           example: "12345678901"
 *         telefone:
 *           type: string
 *           description: "Telefone do beneficiário (10 ou 11 dígitos)."
 *           example: "11987654321"
 *         endereco:
 *           type: string
 *           description: "Endereço do beneficiário."
 *           example: "Rua das Flores, 123"
 *         dataCadastro:
 *           type: string
 *           format: date-time
 *           description: "Data de cadastro do beneficiário."
 *         dataAtualizacao:
 *           type: string
 *           format: date-time
 *           description: "Data da última atualização dos dados."
 */

/**
 * @openapi
 * /beneficiarios:
 *   get:
 *     summary: Lista todos os beneficiários
 *     tags: [Beneficiários]
 *     description: "Retorna uma lista de todos os beneficiários cadastrados no sistema."
 *     responses:
 *       '200':
 *         description: Uma lista de beneficiários.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Beneficiario'
 *       '500':
 *         description: Erro ao buscar os beneficiários.
 */
router.get('/', getAllBeneficiariosController);

/**
 * @openapi
 * /beneficiarios/{id}:
 *   get:
 *     summary: Busca um beneficiário por ID
 *     tags: [Beneficiários]
 *     description: Retorna os detalhes de um beneficiário específico com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do beneficiário.
 *     responses:
 *       '200':
 *         description: Detalhes do beneficiário.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beneficiario'
 *       '404':
 *         description: Beneficiário não encontrado.
 *       '500':
 *         description: Erro ao buscar o beneficiário.
 */
router.get('/:id', getBeneficiarioByIdController);

/**
 * @openapi
 * /beneficiarios:
 *   post:
 *     summary: Cria um novo beneficiário
 *     tags: [Beneficiários]
 *     description: "Adiciona um novo beneficiário ao sistema."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Jose da Silva"
 *               cpf:
 *                 type: string
 *                 example: "11122233344"
 *               telefone:
 *                 type: string
 *                 example: "11912345678"
 *               endereco:
 *                 type: string
 *                 example: "Avenida Principal, 456"
 *     responses:
 *       "201":
 *         description: "Beneficiário criado com sucesso."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beneficiario'
 *       "400":
 *         description: "Requisição inválida (ex: CPF com formato incorreto)."
 *       "409":
 *         description: "Conflito. O CPF informado já está cadastrado."
 *       "500":
 *         description: "Erro interno do servidor."
 */
router.post('/', validate(beneficiarioSchema), createBeneficiarioController);

/**
 * @openapi
 * /beneficiarios/{id}:
 *   put:
 *     summary: Atualiza um beneficiário existente
 *     tags: [Beneficiários]
 *     description: Atualiza os dados de um beneficiário com base no seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do beneficiário.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - cpf
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Jose da Silva Santos"
 *               cpf:
 *                 type: string
 *                 example: "11122233344"
 *               telefone:
 *                 type: string
 *                 example: "11988887777"
 *               endereco:
 *                 type: string
 *                 example: "Avenida Principal, 456, Apto 10"
 *     responses:
 *       '200':
 *         description: Beneficiário atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Beneficiario'
 *       '400':
 *         description: "Requisição inválida."
 *       '404':
 *         description: Beneficiário não encontrado.
 *       '409':
 *         description: Conflito. O novo CPF informado já está em uso por outro beneficiário.
 *       '500':
 *         description: Erro ao atualizar o beneficiário.
 */
router.put('/:id', validate(beneficiarioSchema), updateBeneficiarioController);

/**
 * @openapi
 * /beneficiarios/{id}:
 *   delete:
 *     summary: Remove um beneficiário
 *     tags: [Beneficiários]
 *     description: Remove um beneficiário do sistema. Falhará se ele tiver cartões ou distribuições associadas.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID numérico do beneficiário a ser removido.
 *     responses:
 *       '204':
 *         description: Beneficiário removido com sucesso (Sem conteúdo).
 *       '400':
 *         description: Requisição inválida. O beneficiário possui registros associados (cartões ou distribuições) e não pode ser removido.
 *       '404':
 *         description: Beneficiário não encontrado.
 *       '500':
 *         description: Erro ao deletar o beneficiário.
 */
router.delete('/:id', deleteBeneficiarioController);

export default router;
