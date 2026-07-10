/**
 * 
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 *
 */

/**
 * types
 *
 */
export type TemplateParams = {
    name?: string;
    resetLink: string;
    companyName?: string;
    currentYear?: number;

};

export const resetLinkTemplate =({
    name,
    resetLink,
    companyName = 'Long2Short',
    currentYear = new Date().getFullYear(),

}: TemplateParams): string =>{
    return`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        p {margin: 0;}
        a {text-decoration: none !important; color: inherit !important;}

        .container{
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px !important;
            color: #111;
            max-width: 600px;
            margin: auto;
            background-color: #fff; 
        }

        .wrapper{
            border: 1px solid #fff;
            border-radius: 16px; 
            overflow: hidden;

        }
        .header, .footer{
            text-align: center;
        }

        .header{
            padding: 32px;
            background-color: #c5f0a4;
            color: #0f1709;

        }

        .logo{
            display: block;
            margin: 0 auto 12px;
        }

        .content{
            padding: 32px;
        }

        .button{
            display: block;
            text-align: center;
            padding: 16px;
            font-weight: bold;
            background-color: #c5f0a4;
            color: #0f1709 !important;
            border-radius: 10px;
        }

        .footer{
            margin-top: 32px;
        }

        .footer-text{
            font-size: 13px;
            color: #444;
        }


    </style>
    <title>Document</title>
</head>
<body>
    <div class="container">
        <div class="wrapper">
            <div class="header">
                <img src="/public/images/long2short_logo.svg" width="147" height="36" alt="${companyName}" srcset="">
                <div class="title">Reset Your password</div>
            </div>
            <div class="content">
                <p style="margin-bottom: 20px;"><strong>Hey ${name},</strong></p>
                <p style="margin-bottom: 20px;">
                    we received a request to reset the password asscoiated with Your account.<br/>
                    Click the button to reset Your Password:
                </p>
                <a href="${resetLink}" class="button"> Reset Your password</a>

                <p style="margin-top: 20px;">
                    This link will expire in 1hour for your security. If you didn't request a password reset, you can safely ignore this email, your password will remain unchained. 
                </p>
            </div>
        </div>
        <div class="footer">
            <div class="footer-text">
                If you need help, feel free to contact our support team.
            
                <a href="mailto:support@L2S.li"><strong>support@l2s.li</strong></a>
            </div>
            <div style="margin-top: 12px;" class="footer-text">
                ${currentYear} ${companyName}-All right reserved
            </div>
        </div>
    </div>
</body>
</html>
    `
};

