import joi from 'joi'

const password_regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})')


export const registerRequest =  (req, res, next) => {

    const register = joi.object({
        name: joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        email: joi.string().email().required().messages({
            'string.email': 'Invalid email address',
            'string.empty': 'Email is required',
        }),
        phone: joi.string().min(9).required().messages({
           'string.min': 'Invalid phone number',
            'string.empty': 'Phone number is required',
        }),
        password: joi.string().pattern(password_regex).min(8).required().messages({
            'string.min': 'Invalid password',
            'string.pattern.base': 'Invalid password',
            'string.empty': 'Password is required',
        }),
        address: joi.string().required().messages({
            'string.empty': 'Address is required',
        }),
        city: joi.string().required().messages({ 
            'string.empty': 'City is required',
        }),
    });

    const { error } = register.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
    }

    next();
};


export const loginRequest = (req, res, next) => {
    const login = joi.object({

        email: joi.string().email().required().messages({
            'string.email': 'Invalid email address or password',
            'string.empty': 'Email is required',
        }),
        password: joi.string().pattern(password_regex).min(8).required().messages({
            'string.min': 'Invalid email address or password',
            'string.pattern.base': 'Invalid email address or password',
            'string.empty': 'Password is required',
        }),
    })

    const {error} = login.validate(req.body, {abortEarly:false});

    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
    }

    next()
}

export const updateUserrequest =  (req, res, next) => {

    const user = joi.object({
        name: joi.string().messages({
            'string.empty': 'Name is required',
        }),
        phone: joi.string().min(9).messages({
           'string.min': 'Invalid phone number',
        }),
        address: joi.string().messages({
            'string.empty': 'Adress is required',
        }),
        city: joi.string().messages({ 
            'string.empty': 'City is required',
        }),
    });

    const { error } = user.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
    }

    next();
};