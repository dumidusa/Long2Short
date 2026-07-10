/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//node module
import bcrypt from 'bcrypt';

//custom module

import { verifyPasswordResetToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import nodemailerTransport from '@/lib/nodemailer';
import { passResetInfoTemplate } from '@/mailTemplates/passResetInfo';


//modles
import User from '@/models/user';

//types
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import type {Request, Response}  from 'express';
import type { ResetLinkPayload } from '@/lib/jwt';
import type { IUser } from '@/models/user';
type RequestQuery = { token: string};
type RequestBody = Pick<IUser, 'password'>;

const resetPassword = async(req: Request, res: Response): Promise<void> =>{

    //Get the request query e.g. token
    const { token } = req.query as RequestQuery;

    //Get the password from request body
    const { password }= req.body as RequestBody;

    try{

        //retrieve the reset tiken payload (email) or throw an error
        const { email } = verifyPasswordResetToken(token) as ResetLinkPayload;

        //find the user with given email and select password
        const user = await User.findOne({ email })
        .select('password passwordResetToken name')
        .exec();

        //handle case whe user not found with this email
        if (!user) {
            res.sendStatus(204);
            return;
        }

        //handle case when token doesn't exist in user model
        if (!user.passwordResetToken){
            res.status(404).json({
                code: 'TokenNotFound',
                message: 'This token is already used',
            });
            return;
        }

        //hash the password to upload in database
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        //store updated user password & passwordresettoken to null in db
        user.password = hashPassword;
        user.passwordResetToken = null;
        await user.save();

        //response with a 204 success status'
        res.sendStatus(204);

        //send the email to user
        await nodemailerTransport.sendMail({
            from: '"Long2Short" <sahandumidu4@gmail.com>',
            to: email,
            subject: 'Password Successfully Reset',
            html: passResetInfoTemplate({
                name: user.name,

            }),
        });

    }catch (error){
        //handle case when token is expired
        if( error instanceof TokenExpiredError){
            res.status(401).json({
                code: 'ResetTokenExpired',
                message: 'Your password reset token has been expired',

            });
            return
        }

        //handle case when token is invalid
        if (error instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'ResetTokenError',
                message: 'Invalid reset password token',
            });
            return;
        }



         //response with 500 code for unexpected server error
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
        });

        //log the error details to the logger for debugginf and monitoring
        logger.error('Error during resetting password', error);

    }


};

export default resetPassword;