// Email.js
const transporter = require('./Email.config');
const Verification_Email_Template = require('./EmailTemplate');


const sendverificationcode = async (email, verificationcode) => {
    try {
        const response = await transporter.sendMail({
            from: '"NFT META MART 👻" <sohialshahid706@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Please verify your email address.", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}", verificationcode)
        });

        console.log("Email Successfully Sent", response);
    } catch (error) {
        console.error("Error: Failed to send email.", error); // Provide more detailed error logging
    }
};









module.exports = sendverificationcode; // Export the function for use elsewhere
