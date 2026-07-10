/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */


//node modules
import nodemailer from 'nodemailer';

//custom modules
import config from '@/config';

//create a reusable transporter obj with SMTP transport for sending emails
const nodemailerTransport = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    pool: true,

    auth:{
        user: config.SMTP_AUTH_USERNAME,
        pass: config.SMTP_AUTH_PASS,
    },
});

export default nodemailerTransport;
