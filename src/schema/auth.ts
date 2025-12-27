import z from "zod";
export const register_login_schema = z.object({
  account: z.union([
    z
      .string()
      .regex(
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/,
        { message: "请输入有效的手机号码" }
      ),
    z.email({ message: "请输入有效的电子邮件地址" }),
  ]),

  password: z
    .string()
    .min(6, { message: "密码至少需要6个字符" })
    .max(20, { message: "密码最多20个字符" })
    .regex(/[A-Za-z]/, { message: "密码必须包含至少一个字母" })
    .regex(/\d/, { message: "密码必须包含至少一个数字" }),
});
