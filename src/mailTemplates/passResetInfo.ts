/**
 * @copyright 2026 dumidusahan
 * @license Apache-2.0
 */


//types
type TemplateParams ={
    name?: string;
    supportLink?: string;
    companyName?: string;
    currentYear?: number;

};

export const passResetInfoTemplate= ({
    name,
    companyName = "Long2Short",
    currentYear = new Date().getFullYear(),
}: TemplateParams) =>{
    return `
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
            border: 1px solid #ddd;
            border-radius: 16px;
            overflow: hidden;
        }
        .header, .footer{
            text-align: center;
        }
        .header{
            padding: 32px;
            background-color: #c5f0a4;
            color: #0f1709
        }
        .logo{
            display: block;
            margin: 0 auto 12px;
        }
        .title{
            font-size: 20px;
            font-weight: bold;
        }
        .content{
            padding: 32px;
        }
        .button{
            display:block;
            text-align: center;
            padding: 16px;
            font-weight: bold;
            background-color: #c5f0a4;
            color: #0f1709 !important;
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
                <img src="" alt="" width="147" height="36" class="logo" alt="${companyName}">
                <div class="title">Your password has been Reset Successfully!</div>
            </div>
            <div class="content">
                <p style="margin-bottom: 20px;"><strong>Hey ${name},</strong></p>

                <p style="margin-bottom: 20px;">
                    Your password was successfully changed. Ypu can now log in with your new credentials.
                </p>
                <p style="margin-bottom: 20px;">
                    if you didn't request this change, plase contact us immediately so we can secure your account.
                </p>
                <a href="mailto:support@Long2Short.li" class="button"> Contact Support</a>
                <p style="margin-top: 20px;">
                    For your security, we recomend never sharing your password with anyone and using a strong, unique password for each  services.
                </p>
            </div>
        </div>
        <div class="footer">
            <div class="footer-text">
                If you need help, feelfree to contact our support team
                <a href="mailto:support@Long2Short.li"><strong>Support@Long2Short.li</strong></a>
            </div>
            <div style="margin-top: 12px;" class="footer-text">${currentYear} ${companyName}-All rights reserved</div>
        </div>
    </div>
</body>
</html>
    `
};
