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
        const fileType = /jpeg|jpg|png|gif/
        const extname = fileType.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimeType = fileType.test(file.mimetype)
        if (extname && mimeType) {
            cb(null, true)
        } else {
            cb('error: Image only!')
        }
    },
})

export default upload
