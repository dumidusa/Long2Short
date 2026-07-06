/**
 * @copyright 2026 dumidu sahan 
 * @license Apache-2.0
 */

import type { Request,Response,NextFunction } from "express";
import { TokenExpiredError,JsonWebTokenError } from "jsonwebtoken";
import { TokenPayload, verifyAccessToken } from "@/lib/jwt";
import {logger} from "@/lib/winston";

const authentication = (
    req: Request,
    res: Response,
    next: NextFunction
):void  =>{
    //retrive authentication from requests headers
    const{ authorization} = req.headers;

    //handle case when cleint dont send request with accesstoken
    if(!authorization){
        res.status(401).json({
            code : 'AccessTokenError',
            message: 'Access token is required',
        });
        return;
    }
    //retrive only token from autherization
    const[_, accessToken] = authorization.split(' ');
    try{
        //get the userid from jwt paylaod
        const {userId} = verifyAccessToken(accessToken) as TokenPayload;

        //send the userid to next controller function
        req.userId = userId;

        next();
    }catch(error){
        //handle case when accessToken expired!
        if(error instanceof TokenExpiredError){
            res.status(401).json({
                code: 'AccessTokenExpired',
                message:'Access token expired',
            });
            return;
        }

        //handle case when accessToken is invalid 
        if(error instanceof JsonWebTokenError){
            res.status(401).json({
                code :'AccessTokenError',
                message: 'Invalid access token',
            });
            return;
        }

        //response with 500 status for unexpected server error
        res.status(500).json({
            code : 'ServerError',
            message: 'Internal server error',
        });

        //log the erroir details to the logger for debugging and monitoring
        logger.error('Error while authenticatiing a user',error);
    }
};

export default authentication;

