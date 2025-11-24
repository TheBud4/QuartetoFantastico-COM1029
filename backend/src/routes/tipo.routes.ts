import { Router } from 'express';
import { validate } from '../middlewares/validation.middleware';
import { createTipoSchema } from '../validators/tipo.validator';
import {
  createTipoController,
  getAllTiposController,
  getTipoByIdController,
  updateTipoController,
  deleteTipoController,
} from '../controllers/tipo.controller';

const router = Router();

router.get('/', getAllTiposController);
router.get('/:id', getTipoByIdController);
router.post('/', validate(createTipoSchema), createTipoController);
router.put('/:id', validate(createTipoSchema), updateTipoController);
router.delete('/:id', deleteTipoController);

export default router;
