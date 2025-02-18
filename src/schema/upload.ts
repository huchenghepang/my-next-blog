import Joi from 'joi';




// 定义 Joi 验证模式
export const fileInfoSchema = Joi.object({
    fileName: Joi.string().required(), // 文件名，必填
    createTime: Joi.number().required(), // 创建时间，必填
    fileSize: Joi.number().required(), // 文件大小，必填
    fileType: Joi.string().required(), // 文件类型，必填
    TOTAL_CHUNK: Joi.number().required() // 总块数，必填
}).messages({
    'any.required': '{{#label}} 是必填项',
    'string.base': '{{#label}} 必须是字符串',
    'number.base': '{{#label}} 必须是数字'
});



