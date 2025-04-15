const { header } = require('express-validator');
var jwt = require('jsonwebtoken');
const JWT = 'Sohailisthegreatboy';


const fetchuser =(req,res,next)=>
{
    const token = req.header('auth_token')
    if(!token)
        {
         return res.status(400).json({error:"Please authenticate the valid token"});
        }

        try{
            const data = jwt.verify(token,JWT);
            req.user=data.user;
            next();
        }
        catch{
            // eslint-disable-next-line no-undef
            console.error(error.message);
            res.status(500).send("Some eror occure");

        } 
}
module.exports = fetchuser;


