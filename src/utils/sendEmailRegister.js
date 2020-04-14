const nodemailer = require('nodemailer');

module.exports = function sendEmailRegister(emailRegister) {
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'rubie.luettgen@ethereal.email',
                pass: 'zy3JMKrdpWjYnkgF7e'
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"ByRRista" <register@byrrista.com>', // sender address
            to: `${emailRegister}`, // list of receivers
            subject: `✔ ${emailRegister}, seja bem-vindo ao Byrrista!`, // Subject line
            text: 'Seja encontrado por novos clientes que estão perto de você, no seu bairro!', // plain text body
            html: '<b>Seja encontrado por novos clientes que estão perto de você, no seu bairro!</b>' // html body
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}