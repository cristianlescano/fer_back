import { User } from "../user/model.js"
import { sessionSave  } from "./sessionSave.js"
import {v4 as uuidv4 } from "uuid"
import { sendMail } from "./sendMail.js"
import {secretKey, passOrRegisterKey} from './config.js'
import jwt from 'jsonwebtoken'

export const validateToken = async (req,res, next)=>{
    const {authorization} = req.headers
    if(authorization) {
        try {
            let userId 
            if (req.path !== "/confirm" && req.path !== "/recovery") {
                const checkToken = await User.findOne({"user.auth.token": authorization})
                if(checkToken) userId = jwt.verify(authorization, secretKey) 
                else  return res.json({status:false, message: "Token invalido"})
            } else userId = jwt.verify(authorization, passOrRegisterKey)
            req.token = userId      
        } catch (error) {
            console.log(error)
            return res.json({status:false, message: "Token expirado"})
        }
        
    }
    else return res.json({status: false, message: "No hay autorizacion."})  
    next()
}

export const emptyvalidator = (req, res, next) => {
    const campsArray = [ ...Object.keys(req.body)]
    const isEmpty = campsArray.filter(el => req.body[el].toString().trim() === "" && {el})
    if (isEmpty.length > 0) return res.json({status: false, message: `El campo '${isEmpty.join(", ")}' esta vacio, por favor rellenar`})
   
    if(req.body.email) {
        const reg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/
        const checkReg = req.body.email.match(reg)
        if (!checkReg) return res.json({status: false, message: `El email no tiene un formato bueno`})
    }

    if(req.body.code && req.body.code.toString().length < 5) return res.json({status: false, message: `Poner codigo completo`})

    next()
}

export const changepass = async (req,res)=>{
    const {email} = req.body
    const checkUser = await User.findOne({"user.email": email})

    if(checkUser) { 
        try {
            const codeRandom = Math.random() * (99999 - 10000) + 10000
            const roundCode = Math.round(codeRandom)

            const {user} = await User.findOneAndUpdate({"user.email": email}, {"user.auth.confirm_code": roundCode})
            
            sendMail(
                { email, 
                codeRandom: roundCode, 
                subject: "Cambio de contraseña en (PEDILO)", 
                html: `<p>Tu codigo para el cambio de contraseña: ${roundCode}</p>
                <p>Si no fuiste vos ignora el mensaje</p>`
            }) 

            const token = jwt.sign({userId: user.uid}, passOrRegisterKey, {expiresIn: 60 * 60})

            return res.json({status: true, token, message: "Se envio el codigo al correo"})
        } catch (error) {
            console.log(error)
            return res.json({status: false, error})
        }  
    } 
    res.json({status: false, message: "El correo ingresado no existe en nuestra base de datos"})
}

export const RegisterAccount = async (req,res)=>{
    const {user, email, pass} = req.body
    const codeRandom = Math.random() * (99999 - 10000) + 10000
    try {    
        const findUserQuery = { $or: [ { 'user.user': user}, { 'user.email':email } ] };
        const checkUser = await User.findOne(findUserQuery)
        let uid
        const roundCode = Math.round(codeRandom)

        sendMail(
            { email, 
            codeRandom: roundCode, 
            subject: "Registro en (PEDILO)", 
            html: `<p>Tu codigo para la confirmacion de la cuenta es: ${roundCode}</p>
            <p>Si no fuiste vos ignora el mensaje</p>`
        }) 

        if (!checkUser) {
            uid = uuidv4()
            await User.create({
                user: {
                    uid,
                    email,
                    pass,
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    bio: "",
                    auth: {
                        status: false,
                        confirm_code: roundCode
                    },
                    user
                }
               
            })
            const token = jwt.sign({userId: uid}, passOrRegisterKey, {expiresIn: 15 * 60})
            return res.json({status: true, data: {user, email}, token: token})
        } else if (checkUser && !checkUser.user.auth.status) {
            const updateUser = await User.findOneAndUpdate({'user.email': email}, {"user.auth.confirm_code":  roundCode})
            uid = updateUser.user.uid
            const token = jwt.sign({userId: uid}, passOrRegisterKey, {expiresIn: 15 * 60})
            return res.json({status: true, data: {user, email}, token: token})           
        }   
    } catch (error) {
        console.log(error)
        res.json({status:false, error})
    }       
    return res.json({status: false, message: "El correo ya esta registrado"})
}

export const confirm = async (req,res)=>{
    const { code } = req.body
    const {userId} = req.token
    let token
    let validation = false
    try {
        const checkUser = await User.findOne({$and : [{'user.uid': userId}, {'user.auth.confirm_code': code}]}) 
        if (checkUser) {
            if(!checkUser.user.auth.status) {
                validation = true
                const  ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                token = jwt.sign({userId}, secretKey, {expiresIn: 60 * 60})
                sessionSave(ip, userId)
                await User.findOneAndUpdate({'user.uid': userId}, {
                    'user.auth': {
                        status: true,
                        token
                    }
                })
            } else {
                await User.findOneAndUpdate({'user.uid': userId}, {
                    'user.auth': {
                        status: true
                    }
                })
            }  
        return validation ? res.json({status: true, message: 'Cuenta activada', token}) : res.json({status: true, message: 'Cambio de contraseña exitoso'})
        }
    } catch (error) {
        return res.json({status: false, message: 'Error en la busqueda, intentar mas tarde.'})
    }
    res.json({status: false, message: 'No hay proceso'})
}

export const recovery = async (req,res)=>{
    const {newPass, verifyNewPass} = req.body
    const {userId} = req.token
    
    try {
        const checkUser = await User.findOne({"user.uid": userId})
        if(checkUser && !checkUser.user.auth.confirm_code && checkUser.user.auth.status) {
            if(newPass === verifyNewPass) await User.findOneAndUpdate({"user.uid": userId}, {"user.pass": newPass})
            else return res.json({status: false, message: 'Los dos campos no coinciden'})
        } else return res.json({status: false, message: 'No se pudo aplicar los cambios.'})  
    } catch (error) {
        return res.json({status: false, error })
    }
    res.json({status: true, message: 'Se cambio la contraseña con exito'})
}

export const login = async (req, res) => {
    const {user, pass} = req.body
    const dateNow = new Date().getTime()

    try {
        const queryFind = {$and: [{$or: [{"user.user": user}, {"user.email": user}]}, {"user.pass": pass}]}
        const checkUser = await User.findOne(queryFind)
        let token
        
        if(checkUser)  {
            if(checkUser.user.user_block && (checkUser.user.user_block.locketTo && checkUser.user.user_block.locketTo > dateNow)) return res.json({status: false, message: "Limite de intentos, espere 5 minutos por favor"})
             else if (checkUser.user.user_block && checkUser.user.user_block.tryLogin) await User.findOneAndUpdate(queryFind, {'user.user_block' : null})
            token = jwt.sign({userId: checkUser.user.uid}, secretKey, {expiresIn: 60 * 60})
            const  ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            sessionSave(ip, checkUser.user.uid)
            await User.findOneAndUpdate(checkUser.user.uid, {'user.auth.token' : token} )
            res.json({status: true, token, message: "Ingreso exitoso"})
        } else {
            const queryFindUser = {$or: [{"user.user": user}, {"user.email": user}]}
            const checkExistUser = await User.findOne(queryFindUser)
            const trying = 5
            if(checkExistUser) { 
        
                if(!checkExistUser.user.user_block) await User.findOneAndUpdate(checkExistUser.user.uid, {'user.user_block' : { "tryLogin": 1}} )
                else {
                    if(checkExistUser.user.user_block.locketTo && checkExistUser.user.user_block.locketTo > dateNow) {return res.json({status: false, message: "Limite de intentos, espere 5 minutos por favor"})}
                    if(checkExistUser.user.user_block.locketTo && checkExistUser.user.user_block.locketTo < dateNow) await User.findOneAndUpdate(checkExistUser.user.uid, {'user.user_block' : { "tryLogin": 1}} )
                    if(checkExistUser.user.user_block.tryLogin < trying) await User.findOneAndUpdate(checkExistUser.user.uid, {'user.user_block' : { "tryLogin": checkExistUser.user.user_block.tryLogin + 1}} )
                    else if (!checkExistUser.user.user_block.locketTo) await User.findOneAndUpdate(checkExistUser.user.uid, {'user.user_block' : { locketTo: dateNow + (5 * 60 * 1000)}} )
                }
            }   
            res.json({status: false, message: 'ingreso incorrecto'})
        }
    } catch (error) {
        console.log(error)
        res.json({status: false, error})
    } 
}

