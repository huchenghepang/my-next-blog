import Joi from "joi";
import { pagationErrorMessages } from "./ErrorMessage";

export const getUserInfoListScheme = Joi.object({
    page:Joi.number().required(),
    limit:Joi.number().required(),
    keyword:Joi.string()
}).messages(pagationErrorMessages)

