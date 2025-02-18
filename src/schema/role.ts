import Joi from "joi";
import { stringAndNumberErrorMessages, stringErrorMessages } from "./ErrorMessage";

export const addRoleSchema = Joi.object({
    roleName:Joi.string().required(),
    description:Joi.string().required()
}).messages(stringErrorMessages)

export const updateRoleSchema = Joi.object({
    roleName: Joi.string().required(),
    description: Joi.string().required(),
    roleId:Joi.number().required()
}).messages(stringAndNumberErrorMessages)

export const deleteRoleSchema = Joi.object({
    roleId: Joi.number().required()
}).messages(stringAndNumberErrorMessages)

export const assignRolePermissionsSchema = Joi.object({
    roleId: Joi.number().required(),
    permissionIds: Joi.array().items(Joi.number()).required()  // 确保数组中的每个元素是数字
}).messages(stringAndNumberErrorMessages);
