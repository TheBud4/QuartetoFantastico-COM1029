import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTamanhoSchema } from '../validators/tamanho.validator';
import {
  createTamanhoController,
  getAllTamanhosController,
  getTamanhoByIdController,
  updateTamanhoController,
  deleteTamanhoController,
} from '../controllers/tamanho.controller';

const router = Router();

router.get('/', getAllTamanhosController);
router.get('/:id', getTamanhoByIdController);
router.post('/', validate(createTamanhoSchema), createTamanhoController);
router.put('/:id', validate(createTamanhoSchema), updateTamanhoController);
router.delete('/:id', deleteTamanhoController);

export default router;
