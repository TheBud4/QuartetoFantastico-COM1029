import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema } from '../validators/auth.validator';
import { loginController } from '../controllers/auth.controller';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário no sistema
 *     tags:
 *       - Autenticação
 *     description: Envia email e senha para receber um token de acesso JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@sanem.com"
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: "admin123"
 *     responses:
 *       '200':
 *         description: Login bem-sucedido, retorna o token e dados do usuário.
 *       '401':
 *         description: Credenciais inválidas.
 */
router.post('/login', validate(loginSchema), loginController);

export default router;