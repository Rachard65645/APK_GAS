import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { saltRounds, Secret } from '../utils/utils.js'
import { prisma } from '../../db/db_config/config.js'
import { info } from '../midelwares/email.js'

export const register = async (req, res) => {
    const { name, email, password, phone, adress, ville } = req.body
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds)
        const register = await prisma.users.create({
            data: {
                name,
                email,
                phone: parseFloat(phone),
                adress,
                ville,
                password: hashPassword,
            }, 
        })
        info(email, name)
        res.status(200).json(register)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const token = jwt.sign({ id: user.id, roles: user.roles }, Secret, { expiresIn: '2h' })
        res.status(200).json({ token, Secret })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
