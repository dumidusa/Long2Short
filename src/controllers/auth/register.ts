/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */
//node module
import bcrypt from 'bcrypt';


//custom modules
import { logger } from '@/lib/winston';
import config from '@/config';
import { genarateAccessToken,genarateRefreshToken } from '@/lib/jwt';


//models
import User from '@/models/user';

//utils
import { genarateMongooseId } from '@/utils';   



//types
import type { Request, Response } from "express";
import type {IUser} from '@/models/user';
type RequestBody =Pick<IUser, 'name' | 'email' | 'password' | 'role'>;
const register = async (req:Request, res: Response): Promise<void> => {
    //retrive name,email,password, and role from request body
    const{ name, email, password, role} = req.body as RequestBody;

    //handle case when random user wants to create an admin acc
    if(role === 'admin' && !config.WHITELISTED_EMAILS?.includes(email)){
        res.status(400).json({
            code: 'BadRequest',
            message : 'You are not allowed tp create an admin account',
        });
     
        return;
    } 
    //genarate salt to hash the password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try{
        //genarate custom userId
        const userId = genarateMongooseId();

        //genarate refreshToken for registered user
        const refreshToken = genarateRefreshToken({userId});
        //genarate accessToken for registed user
        const accessToken = genarateAccessToken({userId});

        //inserty a new user doc in db with provided credentials
        const user = await User.create({
            _id : userId,
            name,
            email,
            password: hashPassword,
            role,
            refreshToken,
        });

        //response refreshToken in cookies
        res.cookie('refreshToken',refreshToken,{
            maxAge : config.COOKIE_MAX_AGE,
            httpOnly: config.NODE_ENV === 'production',
            secure : true,
        });

        //response with success status ,accessToken and UserInfo
        res.status(200).json({
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                passwordResetToken : user.passwordResetToken,
                role: user.role,  
            },
            accessToken,

        });



    }catch(error){
        //response with a 500  status code for unexpected server errors
        res.status(500).json({
            code : 'ServerError',
            message: 'Inetrnal server error',
         });
         //log the error details to the logger for debugging and monitering
         logger.error('error during register a user ', error);
    }
};

export default register;