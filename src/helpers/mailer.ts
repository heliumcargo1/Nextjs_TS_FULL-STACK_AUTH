import User from '@/models/userModal';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';


export const sendEmail = async ({ email, emailType, userId }: any) => { 
    try {
        // create hased token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
                })
    
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                })
        }
        
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "1f08efc4d8a382",
              pass: "6565dd942dd854"
            }
        });
        
        const mailOptions = {
            from: "mohdsafi0608@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html:  `${emailType === "VERIFY" ? (
                `<p>
                Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"/>here</a>
                to Verify your email address <br />
                or copy and paste the link in your browser <br /> 
                "${process.env.DOMAIN}/verifyemail?token=${hashedToken}"
                </p>`
            ) : (
                `<p>
                Click <a href="${process.env.DOMAIN}/verifyemailreset?token=${hashedToken}"/>here</a>
                to Reset your password <br />
                or copy and paste the link in your browser <br /> 
                "${process.env.DOMAIN}/verifyemailreset?token=${hashedToken}"
                </p>`
            )}`
        }

        const mailresponse = await transport.sendMail(mailOptions)
        return mailresponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}