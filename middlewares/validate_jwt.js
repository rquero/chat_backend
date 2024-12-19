const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {

    const token = req.header('x-token');

    if ( !token ) {
        res.status(401).json({
            ok: false,
            msg: 'Not authorization'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_KEY);

        console.log(jwt.verify(token, process.env.JWT_KEY));
        req.uid = uid;

        next();



    } catch( err ) {

        res.status(401).json({
            ok: false,
            msg: 'Not authorization'
        });
    }
}

module.exports = {
    validateJWT,
}