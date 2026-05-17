import z from "zod";

export const getUserInfoListScheme = z.object({
  page: z.number(),
  limit: z.number().int().positive(),
  keyword: z.string().optional(),
});

export const PaginationSchema = z.object({
  hasNext: z.union([z.boolean(), z.null()]).optional(),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});
export type Pagination = z.infer<typeof PaginationSchema>;
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
) {
  return z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema,
  });
}

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export const IdRequestSchema = z.object({
  id: z.string(),
});
export type IDRequest = z.infer<typeof IdRequestSchema>;
