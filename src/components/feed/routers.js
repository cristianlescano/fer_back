import express from 'express';
import multer from'multer';
import { validateToken } from '../auth/functions.js';
import {getComidas, insertComida, deleteComida, getComida} from './functions.js';

const router = express();
const storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

const upload = multer({ //multer settings
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg)$/)) {
            cb( new multer.MulterError("LIMIT_UNEXPECTED_FILE") , false);
       }else {
        cb(null, true);
       }
    },
    limits:{
        fileSize: 1024 * 1024 * 10 // 10MB
    }
}).array('imagenes', 5);

router.get('/:id', 
    getComida
);

router.post('/', validateToken, upload, 
    insertComida
);

router.delete('/:id', validateToken,
    deleteComida
);

router.get('/', 
    getComidas
);



router.post('/version', (req,res)=>{
    res.json(process.versions)
}
);


export default router;