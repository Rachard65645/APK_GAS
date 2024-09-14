import jwt from 'jsonwebtoken'
import { Secret } from '../utils/utils.js'

function getRequestToken(req, res) {
    const authHeader = req.headers['authorization']
    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).send('access denied')
    }

    const [bearer, token, ...others] = authHeader.split(' ')
    if (others.length !== 0 || bearer.toLowerCase() !== 'bearer') {
        return res.status(401).send('access denied')
    }

    return token
}

export function isGrantedAccess(role) {
    return (req, res, next) => {
        const token = getRequestToken(req, res)
        if (!token) return res.status(401).send('Access denied')

        try {
            req.user = jwt.verify(token, Secret)
        } catch (e) {
            return res.status(400).send('Invalid token')
        }

        if (!req.user) {
            return res.status(401).send('Utilisateur non trouvé')
        }

        const userRoles = req.user.roles
        if (!userRoles) {
            return res.status(401).send("Rôles de l'utilisateur non trouvés")
        }

        const granted = role.some((role) => userRoles.includes(role))
        if (!granted) {
            return res.status(403).send('Accès refusé')
        }

        next()
    }
}
