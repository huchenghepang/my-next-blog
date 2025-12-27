/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MyAppRouteHandlerRoutes } from "@/types/next";
import { NextRequest, NextResponse } from "next/server";
import { ZodType } from "zod";
import logger from "./logger";
import { sendError } from "./responseHandler/responseHandler";
import { validateRequestThrowErr } from "./validateRequest";
type ApiHandleContext = RouteContext<MyAppRouteHandlerRoutes>;
type ExcludeEmptyObject<T> = T extends object
  ? keyof T extends never
    ? never
    : T
  : T;
type MyParams = ExcludeEmptyObject<
  Awaited<NonNullable<ApiHandleContext["params"]>>
>;
export interface MyNextRequest<T = any> extends NextRequest {
  data: T;
  params: MyParams;
}

type ApiHandler<T = any> = (
  req: NextRequest,
  context: ApiHandleContext
) => Promise<NextResponse>;

interface APIHandleOptionsWithSchema<T> {
  schema: ZodType<T>;
}

interface APIHandleOptionsWithoutSchema {
  schema?: never;
}

type APIHandleOptions<T = any> =
  | APIHandleOptionsWithSchema<T>
  | APIHandleOptionsWithoutSchema;

type InferSchemaData<T> = T extends ZodType<infer U> ? U : never;

// 条件类型：根据是否有 schema 推断 handler 的类型
type HandlerForOptions<TOptions> = TOptions extends { schema: ZodType<infer T> }
  ? (req: MyNextRequest<T>, context: ApiHandleContext) => Promise<NextResponse>
  : (req: MyNextRequest, context: ApiHandleContext) => Promise<NextResponse>;

/**
 * 创建带有数据验证的 API 处理器
 *
 * 当提供 schema 时，req.data 会被自动填充为验证后的数据
 * 并且 TypeScript 能够正确推断类型
 */
export function createApiHandler<TOptions extends APIHandleOptions<any>>(
  handler: HandlerForOptions<TOptions>,
  options?: TOptions
): ApiHandler {
  return async (req: NextRequest, context: ApiHandleContext) => {
    try {
      if (options?.schema) {
        try {
          const schema = options.schema as ZodType<any>;
          const parseData = await validateRequestThrowErr(req, schema);

          (req as MyNextRequest<any>).data = parseData;
        } catch (error) {
          return sendError({
            code: "400",
            errorMessage: (error as Error).message,
          });
        }
      }
      const params = await context.params;
      // @ts-ignore 忽略类型检查，因为 params 类型是动态的
      req.params = params as MyParams;

      const response = await handler(req as any, context);
      return response;
    } catch (error) {
      logger.error({ error: error as Error, message: "api handler error" });
      return sendError({ code: "500", errorMessage: "server error" });
    }
  };
}
