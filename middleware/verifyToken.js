const { jwtSign, jwtVerify, jwtRefresh } = require('./jwt')
const secret = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers.authorization;
    if (typeof bearerHeader === 'undefined') {
        return res.status(403).send({ "err": "Token is not present" });
    }
    const bearer = bearerHeader.split(' ');
    let token = bearer[1];
    let authData;
    try {
        authData = await jwtVerify(token, secret);


    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            const newToken = jwtRefresh(token, '15m')
            token = newToken
            authData = await jwtVerify(token, secret);
        }
        else {
            throw err
        }
    }
    req.token = token;
    req.authData = authData.user;
    next();
};
module.exports = verifyToken;
