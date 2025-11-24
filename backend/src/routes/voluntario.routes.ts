import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createVoluntarioSchema, updateVoluntarioSchema } from '../validators/voluntario.validator';
import { checkAuth, isAdmin } from '../middlewares/auth.middleware';
import {
    createVoluntarioController,
    getAllVoluntariosController,
    getVoluntarioByIdController,
    updateVoluntarioController,
    deleteVoluntarioController
} from '../controllers/voluntario.controller';

const router = Router();

// ROTA PÚBLICA (Opcional: Talvez você queira listar voluntários publicamente? Se não, proteja também)
// Vamos assumir que só quem está logado pode ver a lista
router.get('/', checkAuth, getAllVoluntariosController);
router.get('/:id', checkAuth, getVoluntarioByIdController);

// ROTAS RESTRITAS A ADMINISTRADORES
// Apenas Admin pode CRIAR, EDITAR ou DELETAR usuários
router.post(
    '/',
    checkAuth, // 1. Verifica o token
    isAdmin,   // 2. Verifica se admin = true
    validate(createVoluntarioSchema),
    createVoluntarioController
);

router.put(
    '/:id',
    checkAuth,
    isAdmin,
    validate(updateVoluntarioSchema),
    updateVoluntarioController
);

router.delete(
    '/:id',
    checkAuth,
    isAdmin,
    deleteVoluntarioController
);

export default router;