import Joi from 'joi'

export const productRequest = (req, res, next) => {
    const product = Joi.object({
        name: Joi.string().required().message({
            'string.empty': 'name is required',
        }),
        brand: Joi.string().required().message({
            'string.empty': 'brand is required',
        }),
        width: Joi.string().required().message({
            'string.empty': 'width is required',
        }),
        price: Joi.number().required().message({
            'string.empty': 'price is required',
        }),
        stock: Joi.number().required().message({
            'string.empty': 'price is required',
        }),
        type: Joi.string().required().message({
            'string.empty': 'type is required',
        }),
        description: Joi.string().required().message({
            'string.empty': 'description is required',
        }),
    })
    const { error } = product.validate(req.body, { abortEarly: false })

    if (error) {
        return res.status(400).json({ error: error.details.map((detail) => detail.message).join(', ') })
    }

    next()
}
