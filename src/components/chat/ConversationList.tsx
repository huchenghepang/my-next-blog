"use client";

import { reqConversationsList } from "@/api/chat/conversation";
import { ConversationEntity } from "@/schema";
import { UserInfo } from "@/types";
import { useEffect, useState } from "react";

export default function ConversationList({
  onSelect,
  onCreateNew,
  onDelete,
  isAuthenticated,
  currentUser,
  tempConversations = [], // 添加临时会话参数
  onRefresh, // 添加刷新回调
  refreshTrigger, // 添加刷新触发器
}: {
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  isAuthenticated?: boolean;
  currentUser?: UserInfo | null;
  tempConversations?: { id: string; title: string; createdAt: string }[];
  onRefresh?: () => void; // 刷新回调函数
  refreshTrigger?: number; // 刷新触发器
}) {
  const [conversations, setConversations] = useState<ConversationEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 仅登录后拉取数据
  useEffect(() => {
    if (!isAuthenticated) {
      setConversations([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchConversations = async () => {
      try {
        const res = await reqConversationsList({ page: 1, pageSize: 50 });
        if (mounted) {
          setConversations(res.items || []);
        }
        console.log("aaaa", res);
      } catch (err) {
        console.warn("加载会话失败", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchConversations();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, refreshTrigger]);

  // 合并持久化会话和临时会话
  const allConversations = [
    ...conversations,
    ...tempConversations.map((temp) => {
      const now = new Date();
      return {
        id: temp.id,
        title: temp.title || "新会话",
        updatedAt: now,
        createdAt: now,
        userId: 0, // 临时会话使用0作为userId占位符
        messageCount: 0, // 占位符
        status: "ACTIVE", // 占位符
        tokenCount: 0, // 占位符
      } as ConversationEntity;
    }),
  ];

  // 按日期分组
  const groupedConversations = allConversations.reduce(
    (acc, conv) => {
      const date = new Date(conv.updatedAt).toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(conv);
      return acc;
    },
    {} as Record<string, ConversationEntity[]>,
  );

  const filteredGroups = searchQuery
    ? Object.fromEntries(
        Object.entries(groupedConversations).map(([date, convs]) => [
          date,
          convs.filter((c) =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        ]),
      )
    : groupedConversations;

  return (
    <div className="flex flex-col h-full border-r border-gray-800 w-64 shrink-0">
      {/* 搜索 + 新建 */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onCreateNew}
          disabled={!isAuthenticated}
          className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mb-3  ${
            isAuthenticated
              ? "bg-violet-600 hover:bg-violet-500 text-white"
              : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
          }
          }`}
        >
          ✨ 新对话
        </button>

        {isAuthenticated ? (
          <input
            type="text"
            placeholder="搜索会话..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        ) : (
          <div className="text-center text-gray-500 text-xs py-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            登录后查看历史会话
          </div>
        )}
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto custom-scroll p-2">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3">
              <span className="text-2xl">🔐</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              登录后可保存对话历史
            </p>
            <p className="text-gray-500 text-xs">支持多设备同步</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            加载中...
          </div>
        ) : Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            {searchQuery ? "无匹配结果" : "暂无会话"}
          </div>
        ) : (
          Object.entries(filteredGroups).map(([date, convs]) => (
            <div key={date} className="mb-4">
              <h3 className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {date}
              </h3>
              <div className="space-y-1">
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left group hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="flex-1 text-sm text-gray-900 dark:text-gray-200 truncate">
                      {conv.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-opacity"
                      title="删除会话"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 底部用户信息 */}
      <div className="p-4 border-t border-gray-800">
        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {currentUser.username?.[0]?.toUpperCase() ||
                currentUser.username?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-200 truncate">
                {currentUser.username || currentUser.account}
              </p>
              <p className="text-xs text-gray-500">在线</p>
            </div>
          </div>
        ) : (
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm w-full px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            ⚙️ 设置
          </button>
        )}
      </div>
    </div>
  );
}