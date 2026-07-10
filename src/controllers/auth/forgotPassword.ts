/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//custom module

import {logger} from '@/lib/winston';
import config from '@/config';
import nodemailerTransport from '@/lib/nodemailer';
import { resetLinkTemplate } from '@/mailTemplates/resetLink';

//modules
import User from '@/models/user';

//types
import type { Request,Response} from 'express';
import type {IUser} from "@/models/user";
import { genaratePasswordResetToken } from '@/lib/jwt';
type RequestBody = Pick<IUser, 'email'>;

const forgotPassword = async (req: Request, res: Response): Promise<void> =>{
    //get the email from reqest body
    const {email} = req.body as RequestBody;
    try{
        //get password reset token
        const passwordResetToken = genaratePasswordResetToken({ email });

        //find the user by the email address and select name
        const user = await User.findOne({ email })
        .select('name passwordResetToken')
        .exec();

        //handle case when user not found
        if(!user){
            res.sendStatus(204);
            return;
        }

        //send the reset token to user email
        await nodemailerTransport.sendMail({
            from: '"Long2Short" <sahandumidu4@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: resetLinkTemplate({
                name: user.name,
                resetLink: `${config.CLIENT_ORIGIN}/reset-password?token=${passwordResetToken}`
            }),
        });


        //store the reset token to user email
        user.passwordResetToken = passwordResetToken;
        await user.save();

        //response with 204 no-contact
         res.sendStatus(204);

    }catch(error){
       //response with 500 code for unexpected server error
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
        });

        //log the error details to the logger for debugginf and monitoring
        logger.error('Error during reset link to email', error);

    }

};

export default forgotPassword;