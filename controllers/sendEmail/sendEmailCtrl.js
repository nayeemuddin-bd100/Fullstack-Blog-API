const expressAsyncHandler = require("express-async-handler");
const sgMail = require("@sendgrid/mail");
const EmailMsg = require("../../model/email/EmailMsg");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailCtrl = expressAsyncHandler(async (req, res) => {
    const { user } = req?.headers
    const {to,subject,text} = req?.body

    try {

        const msg = {
					to,// user.email => here  user email is not valid, so used my own email
					from: "ctgnayeem0@gmail.com", 
					subject,
					text
				};
        await sgMail.send(msg)

        const email = await EmailMsg.create({
					fromEmail:"ctgnayeem0@gmail.com",
					toEmail: user?.email,
					message: text,
					subject,
					sentBy: user._id,
				});
        res.json(email);
    } catch (error) {
        res.json(error)
    }
})

module.exports = {sendEmailCtrl}