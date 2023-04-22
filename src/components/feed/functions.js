import {publi} from './model.js';
import {v4 as uuidv4 } from "uuid"
import fs from "fs"

export const insertComida=async (req,res)=>{
   const {userId} = req.token
   
    if(!req.body.publi) return res.json({'result':false, message:'Request not valid'});
        
    let datos = JSON.parse(req.body.publi)
        datos.post.idPubli = uuidv4()
    let nuevaPubli = new publi(datos.post);
    nuevaPubli.publi.fotos =[...req.files.map(file => file.filename)];
    nuevaPubli.user.uid = userId

    try {
        await nuevaPubli.save();
        res.json({status: true, message: "Se creo la publicacion"});
    } catch (err) {
        console.log(err.message);
        res.json({'result':false, message:err.message});
    }
} 

export const getComidas=async (req,res)=>{
    try {
        const {coordenadas,distancia,sinceId,skip} = req.query;
        const latitud=parseFloat(coordenadas.split(',')[0]);
        const longitud=parseFloat(coordenadas.split(',')[1]);
        const skipParam=parseInt(skip || 0);
console.log(latitud,longitud);

        const aggregation = [
            {$geoNear:{
                key : "user.location",
                near:{
                    type: "Point",
                    coordinates: [latitud,longitud]
                },
                spherical:true,
                //distanceMultiplier: 1/1000 ,
                distanceField:"dist",
                //maxDistance:100000000,
                minDistance:0,
            }
        },{ $skip : skipParam },{$sort: {"publi.titulo":1}},{ $limit: 5}
        ];
        const busqueda = await publi.aggregate(aggregation);
        console.log(busqueda)
        res.json(busqueda);
    } catch (err) {
        console.log(err.message);
        res.json({'result':err.message});
    }
} 

export const getComida =async (req,res)=>{
    const {id} = req.params
    try {
        const busqueda = await publi.findOne({idPubli: id})
        if(!busqueda) res.json({status: false, message: "La publicacion no existe"});
        res.json({busqueda});
    } catch (err) {
        console.log(err.message);
        res.json({'result':err.message});
    }
} 

export const deleteComida = async (req, res) => {
    const {id} = req.params
    const {userId} = req.token
    try {
        const checkUser = await publi.findOneAndDelete({$and: [{idPubli: id}, {"user.uid": userId}]})
        if (!checkUser) return res.json({status: false, message: "No se elimino correctamente o no existe"})
        for(const file of checkUser.publi.fotos){
            try {
                await fs.promises.unlink(`uploads/${file}`);
            } catch (err) {
                console.log(err)
                return res.json({status: false, err})
            }
        }
    } catch (error) {
        return res.json({status: false, error})
    }
    return res.json({status: true, message: "Se elimino correctamente"})
}