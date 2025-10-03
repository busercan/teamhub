import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import { PERMISSIONS } from "../utils/permissions";
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
router.get('/getRoles', authorize(PERMISSIONS.ROLE_VIEW), getRoles);
router.get ('/getRoleById/:id', authorize(PERMISSIONS.ROLE_VIEW),  getRoleById);
router.post('/createRole', authorize(PERMISSIONS.ROLE_CREATE), createRole);
router.post('/updateRoleName', authorize(PERMISSIONS.ROLE_UPDATE), updateRoleName);
router.post('/addPermissionToRole', authorize(PERMISSIONS.ROLE_UPDATE), addPermissionToRole);
router.post('/deletePermissionToRole', authorize(PERMISSIONS.ROLE_UPDATE), deletePermissionToRole);
router.delete('/deleteRole', authorize(PERMISSIONS.ROLE_DELETE), deleteRole);

export default router;
