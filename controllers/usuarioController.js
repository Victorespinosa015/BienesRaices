import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'
import {generarId} from '../helpers/tokens.js'
import {emailRegistro} from '../helpers/emails.js'

const formularioLogin =  (req,res)=>{
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

const formularioRegistro =  (req,res)=>{
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) =>{
    //Validaciones 
    await check ('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check ('email').isEmail().withMessage('Eso no parece un Email').run(req)
    await check ('password').isLength({min: 6}).withMessage('El Password debe de ser de almenos 6 caracteres').run(req)
    await check ('repetir_password').equals(req.body.password).withMessage('Los passwords no coinciden').run(req)

    let resultado = validationResult(req)

    //return res.json(resultado.array())
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        //errores
        return  res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario:{ 
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    //Extraer los datos
    const {nombre, email, password} = req.body

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({where : {email}})
    if(existeUsuario){
        return  res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'El Usuario ya esta registrado'}],
            usuario:{ 
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    
    }

    //Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia emails de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        pagina: 'Confirmacion de cuenta',
        mensaje: 'Hemos Enviado un Email de Confirmación'
    })
}

const formularioOlvidePassword =  (req,res)=>{
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}

export{
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}