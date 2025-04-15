const transporter = require('./Email.config');
const NFT_Link_Email_Template = require('./NFT_Link_Email_Template');

const sendemail = async (email, nftLink) => {
    try {
        const response = await transporter.sendMail({
            from: '"NFT META MART 👻" <sohialshahid706@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Your NFT META Link", // Subject line
            text: "Click the link to access your NFT META.", // plain text body
            html: NFT_Link_Email_Template.replace("{nftLink}", nftLink) // replace placeholder with the actual link
        });

        console.log("Email Successfully Sent", response);
    } catch (error) {
        console.error("Error: Failed to send email.", error); // Provide more detailed error logging
    }
};

module.exports = sendemail;