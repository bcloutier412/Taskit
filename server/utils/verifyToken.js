const JWT = require('jsonwebtoken');
const config = require("../utils/config");

const verifyToken = (request, response, next) => {
    if (!request.headers.authorization) {
        return response.status(404).send({ error: "User must provide authorization"})
    }
    try {
        const JWTstr = request.headers.authorization.split(" ")[1];
        const user = JWT.verify(JWTstr, config.SECRET);
        request.user = user;
        next();
    } catch (error) {
        if (error instanceof JWT.TokenExpiredError) {
            console.log("token expired");
            return response.status(401).send()
        } else if (error instanceof JWT.JsonWebTokenError) {
            console.log(error)
            return response.status(401).send()
        } else {
            console.log(error);
            return response.status(401).send()
        }
    }
};

module.exports = verifyToken