import Joi from "joi";
import { errorMessage, stringAndNumberErrorMessages } from "./ErrorMessage";

export const addUserScheme = Joi.object({
    accout: Joi.string().required(),
    password: Joi.string().required()
}).messages(errorMessage);

export const removeUserSchema = Joi.object({
    userId: Joi.string().required()
}).messages(errorMessage);

export const changeUserStatusSchema = Joi.object({
    userId: Joi.string().required(),

    type: Joi.string()
        .valid("password", "account")
        .required(),

    isDelete: Joi.number()
        .valid(0, 1)
        .when("type", { is: "account", then: Joi.required() }),
}).messages(errorMessage);;


export const assignUserRolesSchema = Joi.object({
    userId: Joi.string().required(),
    roleIds: Joi.array().items(Joi.number()).required()  // 确保数组中的每个元素是数字
}).messages(stringAndNumberErrorMessages)