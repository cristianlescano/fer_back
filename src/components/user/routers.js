import express from 'express';
import {getUserReview, getUserProfile, postUserReview} from './functions.js';
import { validateToken, emptyvalidator } from '../auth/functions.js';
const router = express();

router.get('/:id/profile', 
    getUserProfile
);
router.get('/:id/reviews', 
    getUserReview
);
router.post('/:id/reviews', validateToken, emptyvalidator,
    postUserReview
);
router.get('/:id/history', 
    
);
export default router;