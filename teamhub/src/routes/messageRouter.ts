import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getUnreadMessages, saveOfflineMessage } from '../controllers/messageController';

const router = Router();

router.use(authenticate);

router.get('/unread', getUnreadMessages);
router.post('/offline', saveOfflineMessage);

export default router;
