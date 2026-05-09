import express from 'express';
import { 
  getMyEvents, 
  getMyRsvps, 
  updateProfile, 
  updatePassword 
} from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/my-events', getMyEvents);
router.get('/my-rsvps', getMyRsvps);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);

export default router;
