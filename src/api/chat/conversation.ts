import {
  ConversationDataList,
  ConversationEntity,
  ConversationRequest,
  CreateConversationRequest,
  HistoryMessageAndConversation,
  UpdateConversationRequest,
} from "@/schema";
import { IDRequest } from "@/schema/normal";
import { browserAPI } from "../frontendClient";

/**
 * 获取对话列表
 */
export function reqConversationsList(
  data: ConversationRequest,
): Promise<ConversationDataList> {
  return browserAPI.get("/api/chat/conversations", {
    params: data,
  });
}

/**
 * 根据对应的会话，获取会话的消息
 */
export function reqHistoryMessageAndConversation(params: {
  conversation_id: string;
}): Promise<HistoryMessageAndConversation> {
  return browserAPI.get("/api/chat/history_messages", {
    params: params,
  });
}

/**
 * 创建对话
 */
export function reqCreateConversation(
  data: CreateConversationRequest,
): Promise<ConversationEntity> {
  return browserAPI.post("/api/chat/conversations", data);
}

/**
 * 删除对话
 */
export function reqDeleteConversation(id: IDRequest["id"]) {
  return browserAPI.delete(`/api/chat/conversations/${id}`);
}

/**
 * 更新对话
 */
export function reqUpdateConversation(
  id: IDRequest["id"],
  data: UpdateConversationRequest,
): Promise<ConversationEntity> {
  return browserAPI.put(`/api/chat/conversations/${id}`, data);
}
