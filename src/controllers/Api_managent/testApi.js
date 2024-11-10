import axios from "axios"

const URL = 'https://ipinfo.io?token=064b094342bce7'

export const configuration = {
    method: 'GET',
    url: URL, 
   
}


export const position = async (req, res) => {
    try {
        const position = await axios(configuration)

        res.status(200).json(position.data)
    } catch (err) {
        res.status(400).json({error: 'not info'})
    }
} 