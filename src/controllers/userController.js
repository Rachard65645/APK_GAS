import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { saltRounds, Secret, SecretRefresh } from '../utils/utils.js'
import { prisma } from '../../db/db_config/config.js'
import { sendEmail } from '../email/emailRegister.js'

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
        if (register) {
            sendEmail(name, email, adress)
        }
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

        //token
        const token = jwt.sign({ id: user.id, roles: user.roles }, Secret, { expiresIn: '2h' })

        //refresh toke
        const refreshToken = jwt.sign({ id: user.id, roles: user.roles }, SecretRefresh, { expiresIn: '2d' })

        res.status(200).json({ token, refreshToken })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' })
    }
    try {
        const decodedRefreshToken = jwt.verify(refreshToken, SecretRefresh)
        const user = await prisma.users.findUnique({ where: { id: decodedRefreshToken.id } })
        if (!user) {
            return res.status(401).json({ error: 'Invalid user' })
        }

        // new token
        const token = jwt.sign({ id: user.id, roles: user.roles }, Secret, { expiresIn: '2h' })

        //new refresh toke
        const newRefreshToken = jwt.sign({ id: user.id, roles: user.roles }, SecretRefresh, { expiresIn: '2d' })
        res.status(200).json({ token, newRefreshToken })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
