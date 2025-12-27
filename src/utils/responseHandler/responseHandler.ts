import { CustomErrorResponse, CustomResponse } from "@/types/customResponse";
import { ErrorStatusCodeValues, HttpStatusCodeValues } from "@/types/response";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import statusCodes from "./httpStatusCodes.json";

/**
 * 统一成功响应
 * @param data - 返回的数据
 * @param message - 响应信息
 * @param code - HTTP 状态码
 * @returns NextResponse
 */
export function sendResponse<T = null>({
  data = null as T,
  message,
  code = "200",
  detail,
}: {
  data?: T;
  message?: string;
  code?: HttpStatusCodeValues;
  detail?: string;
}) {
  const success = code === "200";
  const response: CustomResponse = {
    success: success,
    code: +code,
    message: message || statusCodes[code].detail,
    // detail:  detail || statusCodes[code].detail  ,
    data,
    timestamp: new Date().toISOString(),
    requestId: uuid(),
  };

  return NextResponse.json(response, { status: +code });
}

/**
 * 统一错误响应
 * @param code - 错误代码（默认 400）
 * @param errorMessage - 错误信息（默认 "请求出错"）
 * @param detail - 详细错误信息（默认 "请求出现异常"）
 * @returns NextResponse
 */
export function sendError({
  code = "400",
  errorMessage,
  detail,
}: {
  code?: ErrorStatusCodeValues;
  errorMessage?: string;
  detail?: string;
}) {
  const response: CustomErrorResponse = {
    success: false,
    code: +code,
    errorMessage: errorMessage || statusCodes[code].message,
    // detail: errorMessage || statusCodes[code].detail,
  };

  return NextResponse.json(response, { status: +code });
}
