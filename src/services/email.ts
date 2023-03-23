import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 587,
    auth : {
        user : 'unparcheadm@gmail.com', 
        pass : 'iecnfzzqflvevlsf'
    }
})

export const sendEmail = async (to:string, message:string, subject:string) => {
    await transporter.sendMail({
        from: 'unparcheadm@gmail.com',
        to: to,
        subject: subject,
        html: message
    })
}