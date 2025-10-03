import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
    getRoles,
    getRoleById,
    createRole,
    updateRoleName,
    addPermissionToRole,
    deletePermissionToRole,
    deleteRole
} from '../controllers/roleController'
const router = Router();

router.use(authenticate);
router.get('/getRoles', getRoles);
router.get ('/getRoleById/:id', getRoleById);
router.post('/createRole', createRole);
router.post('/updateRoleName', updateRoleName);
router.post('/addPermissionToRole', addPermissionToRole);
router.post('/deletePermissionToRole', deletePermissionToRole);
router.delete('/deleteRole', deleteRole);

export default router;
