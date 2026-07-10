/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//node modules
import { Router } from "express";
//import {request,response} from "express";
import {body} from 'express-validator';
import bcrypt from 'bcrypt';

//custom module


//controllers
import register from '@/controllers/auth/register';
import login from '@/controllers/auth/login';
import logout from '@/controllers/auth/logout';
import refreshToken from "@/controllers/auth/refreshToken";
import forgotPassword from "@/controllers/auth/forgotPassword";
import resetPassword from "@/controllers/auth/resetPassword";



//middlewares
import validationError from "@/middlewares/validationErrors";
import authentication from "@/middlewares/authentication";


//models 
import User from "@/models/user";
import expressRateLimit from "@/lib/expressRateLimit";

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



//post route to registerr user
router.post(
    '/login', 
    expressRateLimit('auth'),
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email adress')
    .custom(async (email) =>{
        //find user by email 
        const user = await User.exists({ email }).exec();

        //throw error if user doesnt exit
        if(!user){
            throw new Error('no user found with this email');

        }
    }),
    body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({min :8})
    .withMessage('Password must be at least 8 characters long')
    .custom(async(password, {req})=>{
        //retrive email from request body
        const {email} = req.body;

        //find the user by email
        const user = await User.findOne({email})
        .select('password')
        .lean()
        .exec();

        //handle case when user is null
        if(!user) return;

        //check user password is correct
        const passwordIsValid = await bcrypt.compare(password,user.password);

        //(throw error if password doesn't match
        if(!passwordIsValid){
            throw new Error ('invalid password');
        }

    })

    ,validationError,
    login);

//delete route to logout user
router.delete(
    '/logout',
    expressRateLimit('basic'),
    authentication,
    logout

)

//get route to refresh token
router.get('/refresh-token', expressRateLimit('basic'), refreshToken);

router.post(
    '/forgot-password',
    expressRateLimit('basic'),
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async(email)=>{
        //checl provided email exist in db
        const userExists = await User.exists({ email}).exec();
        //handle case when email doesn't exist
        if(!userExists){
            throw new Error('No user found with this email');
        }
    }),
    validationError,
    forgotPassword,
);


// post route to reset password
router.post(
    '/reset-password',
    expressRateLimit('passReset'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({min: 8})
    .withMessage('Password must be at least 8 characters long'),
    validationError,
    resetPassword
)

export default router;
