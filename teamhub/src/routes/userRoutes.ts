import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth";
import {PERMISSIONS} from "../utils/permissions"
import { rateLimiter } from '../middlewares/rateLimitter';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changePassword,
    deleteUser,
    loginUser,
    logoutUser
} from '../controllers/userController'
const router = Router();
const loginLogoutRateLimiter = rateLimiter({ windowSeconds: 60, maxRequests: 5 });

router.post('/createUser', createUser);
router.post('/loginUser', loginLogoutRateLimiter, loginUser);

router.use(authenticate);
router.get('/getUsers', authorize(PERMISSIONS.USER_VIEW), getUsers);
router.get ('/getUserById/:id', authorize(PERMISSIONS.USER_VIEW), getUserById);
router.post('/updateUser', authorize(PERMISSIONS.USER_UPDATE), updateUser);
router.post('/changePassword/:id', authorize(PERMISSIONS.USER_UPDATE), changePassword);
router.delete('/deleteUser', authorize(PERMISSIONS.USER_DELETE), deleteUser);
router.post('/logoutUser', loginLogoutRateLimiter, logoutUser);


export default router;
