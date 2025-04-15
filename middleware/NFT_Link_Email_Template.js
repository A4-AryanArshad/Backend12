const NFT_Link_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NFT META Link</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: black;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            color: #333;
            line-height: 1.8;
        }
        .nft-link {
            display: block;
            margin: 20px 0;
            font-size: 22px;
            color: #4CAF50;
            background: #e8f5e9;
            border: 1px dashed #4CAF50;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
            letter-spacing: 2px;
            text-decoration: none;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">NFT META MART Friend Invitation Link</div>
        <div class="content">
            <p>Hello,</p>
            <p>You have received a link to access your NFT META. Click the link below to proceed:</p>
            <a href="{nftLink}" class="nft-link">Access Your NFT META</a>
            <p>If you did not request this link, no further action is required. If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} NFT META MART. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = NFT_Link_Email_Template;