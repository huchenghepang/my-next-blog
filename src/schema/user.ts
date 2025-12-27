/* 使用JoiErrorMessages接口进行代码提醒 使用完就删掉 */

import z from "zod";

const change_role_messages = {
  "string.base": "{#key} 必须是字符串",
  "number.base": "{#key} 必须是数字",
  "any.required": " {#key} 字段是必填项",
};

export const change_role_schema = z.object({
  userId: z.string(),
  roleId: z.number(),
});

export const updateUserInfoSchema = z.object({
  userId: z.string(),
  username: z.string().min(2).max(30).optional(),
  avatar: z.url().optional(),
  email: z.email().optional(),
  signature: z.string().max(100).optional(),
});

export const updatePasswordSchema = z
  .object({
    userId: z.string(),
    oldPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/),
    newPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/),
    confirmPassword: z.string().min(1, { message: "确认密码不能为空" }),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: "确认密码必须与新密码相同",
    path: ["confirmPassword"],
  });

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type Change_Role_Schema = z.infer<typeof change_role_messages>

