import { NextRequest } from "next/server";
import { ZodType } from "zod";
import { parseRequestData } from "./parseRequestData";

type ValidateResult<T> =
  | { data: NonNullable<T>; error: null }
  | { data: null; error: string };

/**
 * 验证请求数据的工具函数
 * 使用 Zod 模式验证请求数据，并返回验证结果
 *
 * @param req - Next.js 请求对象，包含需要验证的数据
 * @param schema - Zod 模式，用于验证请求数据的结构和类型
 * @returns Promise<ValidateResult<T>> - 包含验证后数据或错误信息的对象
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.number()
 * });
 *
 * const result = await validateRequest(req, schema);
 * if (result.error) {
 *   // 处理验证错误
 *   console.error(result.error);
 * } else {
 *   // 使用验证后的数据
 *   console.log(result.data);
 * }
 * ```
 */
export async function validateRequest<T = any>(
  req: NextRequest,
  schema: ZodType<T>
): Promise<ValidateResult<T>> {
  const data = await parseRequestData(req);

  if (!data) {
    return { data: null, error: "no valid request data" };
  }

  const validation = schema.safeParse(data);

  if (!validation.success) {
    const errorMessages = validation.error.issues
      .map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      })
      .join("; ");

    return { data: null, error: errorMessages };
  }
  if (!validation.data) {
    return { data: null, error: "no valid request data" };
  }

  return { data: validation.data, error: null };
}

export async function validateRequestThrowErr<T = NonNullable<any>>(
  req: NextRequest,
  schema: ZodType<T>
): Promise<NonNullable<T>> {
  const result = await validateRequest(req, schema);
  if (result.error) {
    throw new Error(result.error);
  }
  if (!result.data) {
    throw new Error("no valid request data");
  }
  return result.data;
}
