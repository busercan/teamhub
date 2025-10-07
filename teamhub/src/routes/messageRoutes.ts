import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { getUnreadMessages, getOnlineUsers } from '../controllers/messageController';

const router = Router();

router.use(authenticate);

router.get('/unread', getUnreadMessages);
router.get('/online', getOnlineUsers);

export default router;
