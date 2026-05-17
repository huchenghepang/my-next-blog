import * as z from "zod";
import { createPaginatedResponseSchema } from "../normal";

export const SortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const StatusSchema = z.enum(["ACTIVE", "ARCHIVED", "DELETED"]);
export type Status = z.infer<typeof StatusSchema>;

export const ConversationRequestSchema = z.object({
  keyword: z.union([z.null(), z.string()]).optional(),
  page: z.union([z.number(), z.null()]).optional(),
  pageSize: z.union([z.number(), z.null()]).optional(),
  sortBy: z.union([z.null(), z.string()]).optional(),
  sortOrder: z.union([SortOrderSchema, z.null()]).optional(),
  status: z.union([StatusSchema, z.null()]).optional(),
  userId: z.union([z.number(), z.null()]).optional(),
});
export type ConversationRequest = z.infer<typeof ConversationRequestSchema>;

export const ConversationEntitySchema = z.object({
  createdAt: z.coerce.date(),
  id: z.string(),
  lastMessageAt: z.union([z.coerce.date(), z.null()]).optional(),
  messageCount: z.number(),
  options: z.union([z.record(z.string(), z.any()), z.null()]).optional(),
  status: StatusSchema,
  title: z.string(),
  tokenCount: z.number(),
  updatedAt: z.coerce.date(),
  userId: z.number(),
});
export type ConversationEntity = z.infer<typeof ConversationEntitySchema>;

export const ConversationDataListSchema = createPaginatedResponseSchema(
  ConversationEntitySchema,
);
export type ConversationDataList = z.infer<typeof ConversationDataListSchema>;

// 内容类型

export const ContentTypeSchema = z.enum([
  "CODE",
  "FILE",
  "IMAGE",
  "TEXT",
  "VIDEO",
  "VOICE",
]);
export type ContentType = z.infer<typeof ContentTypeSchema>;

// 消息角色

export const RoleSchema = z.enum(["ASSISTANT", "SYSTEM", "USER"]);
export type Role = z.infer<typeof RoleSchema>;

export const HistoryMessageAndConversationRequestSchema = z.object({
  conversation_id: z.string(),
});
export type HistoryMessageAndConversationRequest = z.infer<
  typeof HistoryMessageAndConversationRequestSchema
>;

export const MessageEntitySchema = z.object({
  content: z.string(),
  contentType: z.union([ContentTypeSchema, z.null()]).optional(),
  conversationId: z.string(),
  createdAt: z.coerce.date(),
  finishReason: z.union([z.null(), z.string()]).optional(),
  id: z.string(),
  media: z.union([z.record(z.string(), z.any()), z.null()]).optional(),
  model: z.union([z.null(), z.string()]).optional(),
  parentId: z.union([z.null(), z.string()]).optional(),
  role: RoleSchema,
  tokenCount: z.union([z.number(), z.null()]).optional(),
  updatedAt: z.coerce.date(),
  reasoningContent: z.union([z.null(), z.string()]).optional(),
});
export type MessageEntity = z.infer<typeof MessageEntitySchema>;

export const HistoryMessageAndConversationSchema = z.object({
  conversation: ConversationEntitySchema,
  messages: z.array(MessageEntitySchema),
});
export type HistoryMessageAndConversation = z.infer<
  typeof HistoryMessageAndConversationSchema
>;

export const CreateConversationRequestSchema = z.object({
  messageCount: z.union([z.number(), z.null()]).optional(),
  options: z.union([z.record(z.string(), z.any()), z.null()]).optional(),
  status: z.union([StatusSchema, z.null()]).optional(),
  title: z.string(),
  tokenCount: z.union([z.number(), z.null()]).optional(),
  userId: z.union([z.number(), z.null()]).optional(),
});
export type CreateConversationRequest = z.infer<
  typeof CreateConversationRequestSchema
>;
export const UpdateConversationRequestSchema = z.object({
  messageCount: z.union([z.number(), z.null()]).optional(),
  options: z.union([z.record(z.string(), z.any()), z.null()]).optional(),
  status: z.union([StatusSchema, z.null()]).optional(),
  title: z.union([z.null(), z.string()]).optional(),
  tokenCount: z.union([z.number(), z.null()]).optional(),
  userId: z.union([z.number(), z.null()]).optional(),
});
export type UpdateConversationRequest = z.infer<
  typeof UpdateConversationRequestSchema
>;




export const UpdateConversationTitleRequestSchema = z.object({
  isAiGenerated: z.union([z.boolean(), z.null()]).optional(),
  title: z.string(),
});
export type UpdateConversationTitleRequest = z.infer<
  typeof UpdateConversationTitleRequestSchema
>;
