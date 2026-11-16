const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization")
        if(!authHeader) {
            res.json({
                message: "Access denied. Unauthorized"
            })
        }


        const token = authHeader.split(" ")[1]
        console.log("Imcoming token", token)
        jwt.verify(token, 'express' )
        
        
        
        next();
    }   catch (error) {
        console.log("Erroe", error),
        res.json({
            message: `Error ${error}`
        })
        
    }
}

module.exports = authMiddleware