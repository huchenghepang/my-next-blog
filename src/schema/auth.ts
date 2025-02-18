import Joi from 'joi';

export const register_login_schema = Joi.object({
    account: Joi.string().pattern(/^(1[3-9]\d{9}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/).required().messages({
        'string.pattern.base': '账号必须是有效的手机号码或电子邮件地址',
        'string.empty': '账号是必填项'
    }),
    password: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/).required().messages({
        'string.pattern.base': '密码必须是6-20个字符长，并且包含至少一个字母和一个数字',
        'string.empty': '密码是必填项',
    })
})



