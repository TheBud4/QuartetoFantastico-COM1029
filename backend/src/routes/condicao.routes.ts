import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createCondicaoSchema } from '../validators/condicao.validator';
import {
  createCondicaoController,
  getAllCondicoesController,
  deleteCondicaoController,
  getCondicaoByIdController,
  updateCondicaoController,
} from '../controllers/condicao.controller';

const router = Router();

router.get('/', getAllCondicoesController);
router.get('/:id', getCondicaoByIdController);
router.post('/', validate(createCondicaoSchema), createCondicaoController);
router.put('/:id', validate(createCondicaoSchema), updateCondicaoController);
router.delete('/:id', deleteCondicaoController);

export default router;
