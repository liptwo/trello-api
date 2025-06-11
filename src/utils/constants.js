import { ENV } from '~/config/environment'


// những domain được phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' xoa thằng này vi configcors cũng đã cho dev chạy qua rồi
  // vv ví dụ sau này sẽ deploy lên   domain chính thức ...vv

]

export const BOARD_TYPES = {
  PUBLIC:'public',
  PRIVITE:'private'
}

export const WEBSITE_DOMAIN = (ENV.BUILD_MODE === 'dev' ? ENV.WEBSITE_DOMAIN_DEVELOPMENT: ENV.WEBSITE_DOMAIN_PRODUCTION)


export const htmlContent = (verificationLink) => {
  return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #eeeeee;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
            }
            .content {
                padding: 0 20px;
            }
            .verification-link {
                background-color: #f8f9fa;
                border: 1px solid #dddddd;
                padding: 15px;
                text-align: center;
                margin: 25px 0;
                word-break: break-all;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
                text-align: center;
                font-size: 12px;
                color: #777777;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">Liptwo Trello</div>
        </div>
        
        <div class="content">
            <h2 style="margin-top: 0;">Email Verification</h2>
            <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <div class="verification-link">
                ${verificationLink}
            </div>
            
            <p>If you did not request this verification, please ignore this email.</p>
        </div>
        
        <div class="footer">
            <p>Sincerely,<br>The Liptwo Trello Team</p>
            <p>&copy; ${new Date().getFullYear()} Liptwo. All rights reserved.</p>
        </div>
    </body>
    </html>
    `)
}