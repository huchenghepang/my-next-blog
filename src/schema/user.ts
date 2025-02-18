import Joi from 'joi';


/* 使用JoiErrorMessages接口进行代码提醒 使用完就删掉 */


const change_role_messages = {
    "string.base":"{#key} 必须是字符串",
    "number.base":"{#key} 必须是数字",
    "any.required":" {#key} 字段是必填项"
}

export const change_role_schema = Joi.object({
    userId:Joi.string().required(),
    roleId:Joi.number().required()
}).messages(change_role_messages)



export const updateUserInfoSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "用户ID不能为空",
        "string.base": "用户ID必须是字符串",
        "string.empty": "用户ID不能为空"
    }),
    username: Joi.string().min(2).max(30).optional().messages({
        "string.base": "用户名必须是字符串",
        "string.min": "用户名长度不能少于 2 个字符",
        "string.max": "用户名长度不能超过 30 个字符"
    }),
    avatar: Joi.string().uri().optional().messages({
        "string.base": "头像必须是字符串",
        "string.uri": "头像必须是合法的 URL"
    }),
    email: Joi.string().email().optional().messages({
        "string.base": "邮箱必须是字符串",
        "string.email": "邮箱格式不正确"
    }),
    signature: Joi.string().max(100).optional().messages({
        "string.base": "个性签名必须是字符串",
        "string.max": "个性签名不能超过 100 个字符"
    })
});



export const updatePasswordSchema = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "用户ID不能为空",
        "string.base": "用户ID必须是字符串",
        "string.empty": "用户ID不能为空"
    }),
    oldPassword: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/).required().messages({
            'string.pattern.base': '密码必须是6-20个字符长，并且包含至少一个字母和一个数字',
            'string.empty': '密码是必填项',
        }),
    newPassword: Joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/).required().messages({
            'string.pattern.base': '密码必须是6-20个字符长，并且包含至少一个字母和一个数字',
            'string.empty': '密码是必填项',
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.required": "确认密码不能为空",
            "any.only": "确认密码必须与新密码相同"
        })
});


