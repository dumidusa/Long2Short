/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//custom module 
import { genarateAccessToken,genarateRefreshToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";
import config from "@/config";

//modles
import User from "@/models/user";

//types

import type { Request,Response } from "express";
import type {IUser} from "@/models/user";
type RequestBody = Pick<IUser, 'email'>;

const login = async (req: Request, res: Response): Promise<void> =>{
    //exact email adress from request body
     const {email} = req.body as RequestBody;
     try{
        //get the user using provided email adress
        const user = await User.findOne({email}).exec();
        //return if the user doent found 
        if (!user) return;
        //genarate refreshtoken for new login
        const refreshToken = genarateRefreshToken({userId: user._id});
        //genarate access token for new login
        const accessToken = genarateAccessToken({userId:user._id});

        //insert new refresh token in user data
        user.refreshToken = refreshToken;
        await user.save();

        //response refreshtoken in user cookie
        res.cookie('refreshToken', refreshToken,{
            maxAge:config.COOKIE_MAX_AGE,
            httpOnly: config.NODE_ENV === 'production',
            secure:true,
        });

        //response with succeess state , accessToken and userinfo
        res.status(200).json({
            user:{
                _id: user._id,
                name:user.name,
                email:user.email,
                role:user.role,
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
         logger.error('error during login a user ', error);
     }
};

export default login;

