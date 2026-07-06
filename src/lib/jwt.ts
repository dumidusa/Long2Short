/**
 * @copyright 2026 dumidu sahan 
 * @license Apache-2.0
 */

//import node module
import jwt from 'jsonwebtoken';

//custom modules
import config from '@/config'
//types
import type {Types} from 'mongoose';
import {JwtPayload} from 'jsonwebtoken';

export type TokenPayload ={ userId: Types.ObjectId};
export type ResetLinkPayload = {email: string};

//genarate a jwr  acess token with a 30 min expiration
//signs the provided payload using the configered access token secret
const genarateAccessToken =(payload:TokenPayload) =>{
    const token = jwt.sign(payload,config.JWT_ACCESS_SECRET,{
        expiresIn:'30m',
    }); 
    return token;

};

//genarate a jwt refresh token with 7 days expiration
const genarateRefreshToken =(payload:TokenPayload) =>{
    const token = jwt.sign(payload,config.JWT_REFRESH_SECRET,{
        expiresIn:'7d',
    }); 
    return token;

};

//genarate a jwt token for reset password
const genaratePasswordResetToken = (payload: ResetLinkPayload) =>{
    const resetToken = jwt.sign(payload, config.JWT_PASSWORD_RESET_SECRET,{
        expiresIn: '1h',
    });

    return resetToken;
}


//verify accessToken
const verifyAccessToken = (accessToken: string): string | JwtPayload =>{
    return jwt.verify(accessToken, config.JWT_ACCESS_SECRET);
}

//verify accessToken
const verifyRefreshToken = (refreshToken: string) : string | JwtPayload=>{
    return jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
}

//verify password reset token
const verifyPasswordResetToken = (resetToken: string): string | JwtPayload=>{
    return jwt.verify(resetToken, config.JWT_PASSWORD_RESET_SECRET);
};

export {
    genarateAccessToken,
    genarateRefreshToken,
    genaratePasswordResetToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyPasswordResetToken,
};