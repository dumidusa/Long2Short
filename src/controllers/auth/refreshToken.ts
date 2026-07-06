/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//custom modules
import { verifyRefreshToken,genarateAccessToken } from "@/lib/jwt";
import { logger } from "@/lib/winston";

//types
import type { Request, Response } from "express";import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import type { TokenPayload } from "@/lib/jwt";

const refreshToken = async (req: Request, res: Response): Promise<void> =>{
    //retrive refresh token from cookies
    const { refreshToken} = req.cookies;
    //handle case when refresh token doesnt exist
    if(!refreshToken){
        res.status(401).json({
            code: 'Unauthorized',
            message: 'Refresh token required'
        });
        return;
    }
    try{
        const {userId} = verifyRefreshToken(refreshToken) as TokenPayload;
        //genarate new access token
        const accessToken = genarateAccessToken({userId});
        //response the access token with success status
        res.status(200).json({
            accessToken,
        });
    }catch(error){
        // handle case when token is expired
        if(error instanceof TokenExpiredError){
            res.status(401).json({
                code: 'RefreshTokenExpired',
                message: 'Refresh token expired,'
            });
            return;
        }
        //handle case when token is invalid
        if(error instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'RefreshTokenError',
                message: 'Invalid refresh token',
            });
            return;
        }
        //response with 500 code for unexpected server error
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
        });

        //log the error details to the logger for debugginf and monitoring
        logger.error('Error during refresh token', error);

    }
};

export default refreshToken;