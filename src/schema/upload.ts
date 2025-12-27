import z from "zod";

export const fileInfoSchema = z.object({
  fileName: z.string(),
  createTime: z.number(), // 创建时间，必填
  fileSize: z.number(), // 文件大小，必填
  fileType: z.string(), // 文件类型，必填
  TOTAL_CHUNK: z.number(), // 总块数，必填
});

export type FileInfoSchema = z.infer<typeof fileInfoSchema>;
