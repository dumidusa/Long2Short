/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//node modules
import { Router } from "express";
import {body} from 'express-validator';
import bcrypt from 'bcrypt';

//custom module
import expressRateLimit from "@/lib/expressRateLimit";  


//controllers
import register from '@/controllers/auth/register';
//middlewares
import validationError from "@/middlewares/validationErrors";

//models 
import User from "@/models/user";

//initial express router
const router = Router();

//post routes to register userr
router.post('/register',
    expressRateLimit('basic'),
    body('name').trim().notEmpty().withMessage('Name is requeired'),
    body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email adress')
    .custom(async (value) =>{
        //check this  email already in used 
        const userExists = await User.exists({email : value}).exec();

        //handle case when duplicate email found
        if(userExists){
            throw new Error("this email is already in use");
            
        }
    })
    ,
    body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

    body('role')
    .notEmpty()
    .withMessage('role is required')
    .isIn(['user','admin'])
    .withMessage('role is not support')

    ,validationError,
    register);

export default router;
