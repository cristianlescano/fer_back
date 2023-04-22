import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schemaPubli = new Schema({
    idPubli: String,
    fecha: {
        type: Date,
        default: Date.now,
    },
    fechaHasta: {
        type: Date,
        required: true,
    },
    user: {
        uid: {
            type: String,
            //required: true,
        },
        location: {
            type: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: ['Point'],
            },
                coordinates: {
                type: [Number],
            }
        }
    },
    publi: {
        titulo: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        fotos:[ ],
        price: {
            type: Number,
            required: true,
        },
        cant: {
            type: Number,
            required: true,
        },
        unidades: {
            type: String,
            required: true,
        },
        likes:[{
            date:Date,
            uid:String
        }],
        coments: {
            uid: String,
            fecha: Date,
            comment: String,
        } 
    }
    
});



export const publi =  mongoose.model('Publis',schemaPubli);
