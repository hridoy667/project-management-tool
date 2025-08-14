const jwt = require("jsonwebtoken");

exports.EncodeToken = (email, id) => {
    let key = process.env.jwt_key;
    let expire = process.env.jwt_expire_time;
    let payload = { email, id };

    return jwt.sign(payload,key,{expiresIn:expire});
}