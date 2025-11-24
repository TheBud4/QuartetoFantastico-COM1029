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

router.get('/', getAllBeneficiariosController);
router.get('/:id', getBeneficiarioByIdController);
router.post('/', validate(beneficiarioSchema), createBeneficiarioController);
router.put('/:id', validate(beneficiarioSchema), updateBeneficiarioController);
router.delete('/:id', deleteBeneficiarioController);

export default router;
