import joi from 'joi'

const password_regex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
)

export const registerRequest = joi.object({

    name: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.number().min(12).required(),
    password: joi.string().pattern(password_regex).min(8).required(),
    adress: joi.string().required(),
    ville: joi.string().required()

})
