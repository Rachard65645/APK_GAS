import axios from 'axios'

const URL = 'https://ipinfo.io/?token=064b094342bce7'

export const api = async (req, res) => {
    try {
        const config = {
            method: 'GET',
            url: URL, 
            headers: {
                Accept: 'application/json ipinfo.io',
                Accept: 'application/json ipinfo.io/8.8.8.8',
            },
        }

        const response = await axios(config)
        res.status(200).json(response.data)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
