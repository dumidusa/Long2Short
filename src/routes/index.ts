/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//node modules
import {Router} from 'express';
import authRouter from '@/routes/auth'; 
//routes


//initial express router
const router = Router();

router.get('/',(req,res)=>{
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://docs.Long2Short.dumidusahan.com',
        timestamp: new Date().toISOString(),
    })
})
//auth routes
router.use('/auth', authRouter);

export default router;
