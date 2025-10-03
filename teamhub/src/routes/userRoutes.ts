import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
    loginUser
} from '../controllers/userController'
const router = Router();

router.post('/createUser', createUser);
router.post('/loginUser', loginUser);

router.use(authenticate);
router.get('/getUsers', getUsers);
router.get ('/getUserById/:id', getUserById);
router.post('/updateUser', updateUser);
router.post('/changePassword/:id', changePassword);
router.delete('/deleteUser', deleteUser);


export default router;
