import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} from '../controllers/taskController'
const router = Router();

router.use(authenticate);
router.get('/getTasks', getTasks);
router.get ('/getTaskById/:id', getTaskById);
router.post('/createTask', createTask);
router.post('/updateTask', updateTask);
router.delete('/deleteTask', deleteTask);

export default router;
