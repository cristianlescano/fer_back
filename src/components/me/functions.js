import { User } from "../user/model.js"

export const updateUserDataPublic = async (req,res)=>{
    const {userId} = req.token
  
    if(!req.body.user) return res.json({'result':false, message:'Request not valid'});
    const {address, city, state, country, bio} = req.body.user
    try {
        const checkUser = await User.findOneAndUpdate({"user.uid": userId}, {"user.address": address , "user.city": city, "user.state":state, "user.country":country, "user.bio":bio})
        if(checkUser) return res.json({status: true, message: "Se actualizo"})
    } catch (error) {
        console.log(error)
        return res.json({status: false, error})
    }
    return res.json({status: false, message: "No se pudo actualizar, el usuario no coincide"})
}