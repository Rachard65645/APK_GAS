import Joi from 'joi'

export const storeRequest = () => {
    const store = Joi.object({
        name: Joi.string().required().message({
            'string.empty': 'name is required',
        }),

        city: Joi.string().required().message({
            'string.empty': 'city is required',
        }),

        address: Joi.string().required().message({
            'string.empty': 'address is required',
        }),

        pseudo: Joi.string().required().message({
            'string.empty': 'pseudo is required',
        }),

        logo: Joi.string().required().message({
            string: 'logo is required',
        }),
    })
}
