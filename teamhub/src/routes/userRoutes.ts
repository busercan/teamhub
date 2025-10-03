import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changePassword,
    deleteUser
} from '../controllers/userController'
const router = Router();

router.get('/getUsers', getUsers);
router.get ('/getUserById/:id', getUserById);
router.post('/createUser', createUser);
router.post('/updateUser', updateUser);
router.post('/changePassword/:id', changePassword);
router.delete('/deleteUser', deleteUser);

export default router;
