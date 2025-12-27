import z from "zod";
const schema = z
  .object({
    type: z.string().optional(),
    fieldName: z
      .number()
      .refine((val) => [0, 1].includes(val ?? -1), {
        message: "必须是 0 或 1",
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.type === "account") {
        return data.fieldName !== undefined;
      }
      return true;
    },
    {
      message: "当 type 为 'account' 时，fieldName 为必填",
      path: ["fieldName"],
    }
  );
export const addUserScheme = z.object({
  account: z.string().min(6, { message: "account 必须至少6个字符" }),
  password: z.string().min(6, { message: "password 必须至少6个字符" }),
});

export const removeUserSchema = z.object({
  userId: z.string().min(6),
});

export const changeUserStatusSchema = z.object({
  userId: z.string().min(6),

  type: z.enum(["password", "account"]),

  isDelete: z
    .number()
    .int()
    .refine((val) => [0, 1].includes(val), {
      message: "isDelete 必须是 0 或 1",
    }),
});

export const assignUserRolesSchema = z.object({
  userId: z.string().min(6),
  roleIds: z.array(z.number()).min(1, { message: "roleIds 不能为空" }),
});

export type ChangeUserStatusSchema = z.infer<typeof changeUserStatusSchema>;
export type AssignUserRolesSchema = z.infer<typeof assignUserRolesSchema>;
export type RemoveUserSchema = z.infer<typeof removeUserSchema>;
export type AddUserSchema = z.infer<typeof addUserScheme>;
