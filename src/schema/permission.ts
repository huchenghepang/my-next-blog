import Joi from "joi";
import { errorMessage } from "./ErrorMessage";




export const addPermissionSchema = Joi.object({
    permissionName: Joi.string().required(),
    description:Joi.string().required(),
    type: Joi.string().valid('route', 'button').required(),
    parentId:Joi.number().required(),
    permissionValue:Joi.string().required()
}).messages(errorMessage)

export const deletePermissionSchema = Joi.object({
    permissionId:Joi.number().required()
}).messages(errorMessage)

export const UpdatePermissionSchema = Joi.object({
    permissionName: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid('route', 'button').required(),
    parentId: Joi.number().required(),
    permissionValue: Joi.string().required(),
    permissionId: Joi.number().required()
}).messages(errorMessage)