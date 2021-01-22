const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET
const jwter = {
    // Promisify jwt.verify
    jwtVerify: function (token, secret) {
        return new Promise((res, rej) => {
            jwt.verify(token, secret, (err, authData) => {
                if (err) {
                    rej(err);
                } else {
                    res(authData);
                }
            });
        });
    },

    // Promisify jwt.sign
    jwtSign: function (user, expireTime) {
        return new Promise((res, rej) => {
            jwt.sign({ user }, secret, { expiresIn: expireTime }, (err, token) => {
                if (err) {
                    rej(err)
                } else {
                    res({ token })
                }
            })
        })
    },
    jwtRefresh: function (token, expireTime) {
        const decoded = jwt.decode(token);
        return jwt.sign({ user: decoded.user }, secret, { expiresIn: expireTime })

    }
}
module.exports = jwter