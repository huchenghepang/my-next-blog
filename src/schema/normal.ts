import z from "zod";

export const getUserInfoListScheme = z.object({
  page: z.number(),
  limit: z.number().int().positive(),
  keyword: z.string().optional(),
});
