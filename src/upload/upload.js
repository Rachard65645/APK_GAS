import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req, file, cb) => {
        cb(null, file.filename + '_' + Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({
    storage: storage,
    limits: { fieldSize: 1000000 }, //1 mo
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|jpg|png|pdf/
        const extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimeType = fileType.test(file.mimetype)
        if (extname && mimeType) {
            cb(null, true)
        } else {
            cb('error: Image only!')
        }
    },
})

const uploadFiles = upload.fields([
    { name: 'CNI', maxCount: 1 },
    { name: 'RCCM', maxCount: 1 },
    { name: 'Patente', maxCount: 1 },
    { name: 'CC', maxCount: 1 },
    {name: 'logo', maxCount: 1}
])

export {uploadFiles}
