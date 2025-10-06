import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { PERMISSIONS } from '../utils/permissions';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
const router = Router();

router.use(authenticate);
router.get('/getTasks', authorize(PERMISSIONS.TASK_VIEW), getTasks);
router.get('/getTaskById/:id', authorize(PERMISSIONS.TASK_VIEW), getTaskById);
router.post('/createTask', authorize(PERMISSIONS.TASK_CREATE), createTask);
router.post('/updateTask', authorize(PERMISSIONS.TASK_UPDATE), updateTask);
router.delete('/deleteTask', authorize(PERMISSIONS.TASK_DELETE), deleteTask);

export default router;
