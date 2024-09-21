import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { saltRounds, Secret, SecretRefresh } from '../utils/utils.js'
import { prisma } from '../../db/db_config/config.js'
import { sendEmail } from '../email/emailRegister.js'

export const register = async (req, res) => {
    const { name, email, password, phone, address, city } = req.body
    try {
        const hashPassword = await bcrypt.hash(password, saltRounds)
        const register = await prisma.users.create({
            data: {
                name,
                email,
                phone,
                address,
                city,
                password: hashPassword,
            },
        })
        res.status(200).json(register)
        if (register) {
            sendEmail(name, email, address)
        }
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

export const currentUser = async (req,res) => {
    const user_id = req.user.id
    try {
        const user = await prisma.users.findFirst({where:{id:user_id}})
        if (!user) {
            res.status(400).json({ error: 'user not found'})
        }

        req.user = user
           
        return res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
} 

export const fetchUser = async (req,res) =>{
    try {
        const userMany = await prisma.users.findMany({
            select:{
                name:true,
                phone:true,
                city:true,
                address:true,
                coordonner:{
                    select:{
                        longitude:true,
                        latitude:true
                    }
                }
            }
        })
        res.status(200).json(userMany)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const findUniqueUser = async (req,res) =>{
    const id = req.params.id
    try {
        const userUnique = await prisma.users.findUnique({
            where: {id},
            select:{
                name:true,
                phone:true,
                city:true,
                address:true,
                coordonner:{
                    select:{
                        longitude:true,
                        latitude:true
                    }
                }
            }
        })
        res.status(200).json(userUnique)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const updateUser = async(req,res)=>{
    const { name,phone,address,city } = req.body
    const id = req.params.id
    try {
        const user = await prisma.users.findUnique({where:{id}})
        if (!user) {
            res.status(400).json({"error": "user not found"})
        }
        const up = await prisma.users.update({
          where:{id}, 
          data:{
            name,
            address,
            city,
            phone
          }
        })
        res.status(200).json(up)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}


