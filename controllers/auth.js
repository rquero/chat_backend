const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');


const createUser = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {

        const emailUnique = await User.findOne({ email });

        if ( emailUnique ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo está registrado'
            });
        }

        const user = new User(req.body);
        
        const salt = bcrypt.genSaltSync();

        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        const token = await generateJWT( user.id );
        
        
        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error'
        });
    }
}

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const userDB = await User.findOne({ email });
        

        if ( !userDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Credencial incorrecta'
            });
        }

        const validPassword = bcrypt.compareSync(password, userDB.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            }); 
        }

        const token = await generateJWT( userDB._id );
        
        res.json({
            ok: true,
            userDB,
            token
        });



    } catch ( err ) {
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
}

const renewToken = async (req, res = response) => {

    const { uid } = req;

    const token = await generateJWT( uid );


    const userDB = await User.findById( uid );


    console.log('req: ', req.uid);
    res.status(200).json({
        ok: true,
        userDB,
        token
    });
}

module.exports = {
    createUser,
    login,
    renewToken
};