// welcome.js

const transporter = require('./Email.config');
const Welcome_Email_Template = require('./welcomeTemplate');

const welcomeemail = async (name, email) => {
    try {
        const response = await transporter.sendMail({
            from: '"NFT META MART 👻" <sohialshahid706@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome to Our Community!", // Subject line
            text: "Please verify your email address.", // plain text body
            html: Welcome_Email_Template.replace("{name}", name)
        });

        console.log("Email Successfully Sent", response);
    } catch (error) {
        console.error("Error: Failed to send email.", error); // Provide more detailed error logging
        throw error; // Re-throw the error for further handling if necessary
    }
};

module.exports = welcomeemail; // Export the function
