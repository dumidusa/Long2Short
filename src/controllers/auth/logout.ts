/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 * 
 */

//models
import {logger} from "@/lib/winston";
import config from "@/config";

//models
import User from '@/models/user';

//type
import type { Request, Response } from  'express';

const logout = async(req:Request,res:Response): Promise<void> =>{
    const userId = req.userId;
    try{
        await User.updateOne({_id:userId},{refreshToken:null});

        //clear the cookies from client
        res.clearCookie('refreshToken',{
            maxAge: config.COOKIE_MAX_AGE,
            httpOnly:config.NODE_ENV === 'production',
            secure:true
        });

        //response success with no content
        res.sendStatus(204);
    }catch(error){
        //response with 500 code for unexpected server error
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
        });

        //log the error details to the logger for debugginf and monitoring
        logger.error('Error during logout a user', error);

    }
};

export default logout;

