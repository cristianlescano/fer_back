import multer from "multer";

const errors=(err, req, res, next) => {
    //Catch multer error
    if (err instanceof multer.MulterError) {
        let message = '';
        if (err.code === 'LIMIT_FILE_SIZE'){ message='Archivo excede el tamaño permitido' };
        if (err.code === 'LIMIT_FILE_COUNT'){ message='No debe exceder el numero máximo de archivos' };
        if (err.code === 'LIMIT_UNEXPECTED_FILE'){ message='Tipo de archivo no permitido' };
        console.info({
            code:err.code,
            message: message.length ? message : err.message,
            files: req.files,
            body: req.body
        });
        return res.status(400).json({
            ok: false,
            message: message.length ? message : err.message
        })
    }
    console.error(err.stack);
    res.status(500).send('Server error!');
};

export default errors;