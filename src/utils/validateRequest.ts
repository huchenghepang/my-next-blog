import { Schema } from "joi"; // 确保已安装 Joi
import { NextRequest } from "next/server";

import { parseRequestData } from "./parseRequestData"; // 你之前的解析函数


type ValidateResult<T> =
    | { data: T; error: null }
    | { data: null; error: string };

export const validateRequest = async <T>(
    req: NextRequest,
    schema: Schema
): Promise<ValidateResult<T>> => {
    const data = await parseRequestData(req) as T;

    if (!data) {
        return { data: null, error: "没有有效的验证信息" };
    }

    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message).join("; ");
        return { data: null, error: errorMessages };
    }

    return { data: value as T, error: null };
};

