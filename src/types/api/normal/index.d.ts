/**
 * PaginationResponseEntity
 */
export interface PaginationResponseEntity {
  /**
   * 是否有下一页
   */
  hasNext: boolean;
  /**
   * 页码
   */
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  data?: T;
  /**
   * 詳情信息
   */
  detail?: string;
  /**
   * 請求響應的消息
   */
  message?: string;
  /**
   * 請求的唯一標識
   */
  requestId?: string;
  success: boolean;
  /**
   * 請求響應的時間戳
   */
  timestamp?: string;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: PaginationResponseEntity;
  [property: string]: any;
}
