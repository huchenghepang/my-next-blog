
export interface RequestConfig extends RequestInit {
  url?: string;
  params?: Record<string, any>;
  timeout?: number;
  __isRetryRequest?: boolean;
  __originalRequest?: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: any;
    __isRetryRequest?: boolean;
  };
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

export interface RequestClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onUnauthorized?: () => void;
}

// ==================== Fetch 客户端类 ====================

export class FetchClient {
  private baseURL: string;
  private defaultConfig: RequestInit;
  private timeout: number;
  private onUnauthorized?: () => void;
  private requestInterceptors: Array<
    (config: RequestConfig) => Promise<RequestConfig>
  > = [];
  private responseInterceptors: Array<(response: Response) => Promise<any>> =
    [];
  private responseErrorInterceptors: Array<(error: any) => Promise<any>> = [];

  constructor(options: RequestClientOptions = {}) {
    this.baseURL = options.baseURL || "";
    this.timeout = options.timeout || 30000;
    this.onUnauthorized = options.onUnauthorized;
    this.defaultConfig = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };
  }

  addRequestInterceptor(
    interceptor: (config: RequestConfig) => Promise<RequestConfig>,
  ): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(
    onFulfilled?: (response: Response) => Promise<any>,
    onRejected?: (error: any) => Promise<any>,
  ): void {
    if (onFulfilled) {
      this.responseInterceptors.push(onFulfilled);
    }
    if (onRejected) {
      this.responseErrorInterceptors.push(onRejected);
    }
  }

  private async runRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    let result = config;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }

  async runResponseInterceptors<T>(response: Response): Promise<T> {
    let result = response;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    return result as T;
  }

  private async runResponseErrorInterceptors(error: any): Promise<any> {
    let result = error;
    for (const interceptor of this.responseErrorInterceptors) {
      try {
        result = await interceptor(result);
      } catch (e) {
        result = e;
      }
    }
    throw result;
  }

  private buildURL(url: string, params?: Record<string, any>): string {
    const base = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    const path = url.startsWith("/") ? url : `/${url}`;
    const fullURL = url.startsWith("http") ? url : `${base}${path}`;

    if (!params) return fullURL;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number = this.timeout,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout: ${url}`);
      }
      throw error;
    }
  }

  async request<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
    try {
      let mergedConfig: RequestConfig = {
        ...this.defaultConfig,
        ...config,
        headers: {
          ...this.defaultConfig.headers,
          ...config.headers,
        },
      };

      const { params, timeout = this.timeout, ...restConfig } = mergedConfig;
      const fullURL = this.buildURL(url, params);

      mergedConfig = await this.runRequestInterceptors({
        ...restConfig,
        url: fullURL,
      } as RequestConfig);

      // 保存原始请求配置，用于重试
      const originalRequestConfig = {
        url: fullURL,
        method: mergedConfig.method || "GET",
        headers: { ...mergedConfig.headers } as Record<string, string>,
        body: mergedConfig.body,
        __isRetryRequest: mergedConfig.__isRetryRequest,
      };

      const response = await this.fetchWithTimeout(
        fullURL,
        mergedConfig,
        timeout,
      );

      (response as any).__originalRequest = originalRequestConfig;

      const result = await this.runResponseInterceptors<T>(response);
      return result as T;
    } catch (error) {
      throw await this.runResponseErrorInterceptors(error);
    }
  }

  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async upload<T = any>(
    url: string,
    formData: FormData,
    config: RequestConfig & {
      headers?: {
        "Content-Type"?: undefined | string;
      };
    } = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: formData,
      headers: {
        ...config?.headers,
      },
    });
  }
}

// ==================== 创建客户端实例 ====================

let getAccessToken: () => string | null = () => null;
let getRefreshToken: () => string | null = () => null;
let setAccessToken: (token: string | null) => void = () => {};
let setRefreshToken: (token: string | null) => void = () => {};
let logout: () => void = () => {};
let showMessage: (
  msg: string,
  type?: "success" | "error" | "warning",
) => void = (msg) => {
  console.log(msg);
};

export function configureClient({
  getToken,
  getRefresh,
  setToken,
  setRefresh,
  onLogout,
  onMessage,
}: {
  getToken: () => string | null;
  getRefresh: () => string | null;
  setToken: (token: string | null) => void;
  setRefresh: (token: string | null) => void;
  onLogout: () => void;
  onMessage: (msg: string, type?: "success" | "error" | "warning") => void;
}) {
  getAccessToken = getToken;
  getRefreshToken = getRefresh;
  setAccessToken = setToken;
  setRefreshToken = setRefresh;
  logout = onLogout;
  showMessage = onMessage;
}

let refreshTokenFn: () => Promise<{
  accessToken: string;
  refreshToken: string;
}> = async () => {
  throw new Error("refreshToken function not configured");
};

export function configureRefreshToken(
  fn: () => Promise<{ accessToken: string; refreshToken: string }>,
) {
  refreshTokenFn = fn;
}

// 创建一个全局的请求重试管理器
let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

async function processPendingRequests(token: string, error?: any) {
  if (error) {
    pendingRequests.forEach(({ reject }) => reject(error));
  } else {
    for (const { resolve, config } of pendingRequests) {
      try {
        // 更新请求头中的 token
        const newHeaders = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(config.url, {
          method: config.method,
          headers: newHeaders,
          body: config.body,
        });

        resolve(response);
      } catch (err) {
        resolve(null); // 避免阻塞，实际上应该 reject，但为了简单处理
      }
    }
  }
  pendingRequests = [];
}

export function createRequestClient(
  baseURL: string,
  options?: RequestClientOptions,
) {
  const client = new FetchClient({
    baseURL,
    ...options,
  });

  async function doReAuthenticate() {
    console.warn("Access token or refresh token is invalid or expired.");
    setAccessToken(null);
    setRefreshToken(null);
    logout();
  }

  async function doRefreshToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("Refresh token is empty.");
    }

    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await refreshTokenFn();
      setAccessToken(accessToken);
      setRefreshToken(newRefreshToken);
      return accessToken;
    } catch (error) {
      await doReAuthenticate();
      throw error;
    }
  }

  function formatToken<T = string | undefined>(token: T): string {
    return token ? `Bearer ${token}` : "";
  }

  // 请求拦截器：添加认证头
  client.addRequestInterceptor(async (config) => {
    const isRefreshRequest = config.url?.includes("/auth/refresh");

    if (isRefreshRequest) {
      const refreshToken = getRefreshToken() || "";
      config.headers = {
        ...config.headers,
        Authorization: formatToken(refreshToken),
      };
      config.__isRetryRequest = true;
    } else {
      const accessToken = getAccessToken() || "";
      config.headers = {
        ...config.headers,
        Authorization: formatToken(accessToken),
      };
    }

    return config;
  });

  // 响应拦截器：处理 401 和 token 刷新
  client.addResponseInterceptor(
    async (response: Response) => {
      // 如果不是 401，直接返回
      if (response.status !== 401) {
        return response;
      }

      const originalRequest = (response as any).__originalRequest;

      // 如果没有原始请求配置或已经是重试请求，直接跳转登录
      if (!originalRequest || originalRequest.__isRetryRequest) {
        await doReAuthenticate();
        throw new Error("Unauthorized");
      }

      // 避免刷新 token 接口死循环
      if (originalRequest.url?.includes("/auth/refresh")) {
        await doReAuthenticate();
        throw new Error("Refresh token failed");
      }

      // 如果正在刷新 token，将当前请求加入等待队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        // 刷新 token
        const newToken = await doRefreshToken();

        // 更新请求头
        const updatedHeaders = {
          ...originalRequest.headers,
          Authorization: formatToken(newToken),
        };

        // 重试原始请求
        const retryResponse = await fetch(originalRequest.url, {
          method: originalRequest.method,
          headers: updatedHeaders,
          body: originalRequest.body,
        });

        // 处理等待中的请求
        await processPendingRequests(newToken);

        // 如果重试成功，返回结果
        if (retryResponse.ok) {
          // 读取响应内容
          const clonedResponse = retryResponse.clone();
          const data = await clonedResponse.json();

          // 创建一个新的 Response 对象，包含解析后的数据
          const finalResponse = new Response(JSON.stringify(data), {
            status: retryResponse.status,
            statusText: retryResponse.statusText,
            headers: retryResponse.headers,
          });
          (finalResponse as any).__originalRequest = originalRequest;
          (finalResponse as any).__isRetryResponse = true;

          return finalResponse;
        } else {
          throw new Error(`Retry failed with status ${retryResponse.status}`);
        }
      } catch (error) {
        // 刷新失败，处理所有等待中的请求
        await processPendingRequests("", error);
        await doReAuthenticate();
        throw error;
      } finally {
        isRefreshing = false;
      }
    },
    async (error: any) => {
      let errorMessage = "";

      if (error.response) {
        const responseData = error.data || {};
        errorMessage =
          responseData?.message || responseData?.msg || responseData?.error;

        if (!errorMessage) {
          const status = error.response.status;
          switch (status) {
            case 400:
              errorMessage = "请求参数错误";
              break;
            case 401:
              errorMessage = "未授权，请重新登录";
              break;
            case 403:
              errorMessage = "拒绝访问";
              break;
            case 404:
              errorMessage = "请求资源不存在";
              break;
            case 500:
              errorMessage = "服务器内部错误";
              break;
            case 502:
              errorMessage = "网关错误";
              break;
            case 503:
              errorMessage = "服务不可用";
              break;
            case 504:
              errorMessage = "网关超时";
              break;
            default:
              errorMessage = `请求失败: ${status}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = "网络请求失败";
      }

      showMessage(errorMessage, "error");
      throw error;
    },
  );

  return client;
}

// ==================== 导出默认实例 ====================

export interface IRequestClient {
  get: <T = any>(url: string, config?: RequestConfig) => Promise<T>;
  post: <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ) => Promise<T>;
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>;
  delete: <T = any>(url: string, config?: RequestConfig) => Promise<T>;
  patch: <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ) => Promise<T>;
  request: <T = any>(url: string, config?: RequestConfig) => Promise<T>;
  upload: <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig & {
      headers?: Record<"Content-Type", string>;
    },
  ) => Promise<T>;
}

let _client: FetchClient | null = null;

export const requestClient: IRequestClient = {
  get: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
  post: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
  put: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
  delete: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
  patch: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
  request: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
  upload: () => {
    throw new Error("Client not configured. Please call initClient first.");
  },
};

export function initClient(baseURL: string, options?: RequestClientOptions) {
  _client = createRequestClient(baseURL, options);

  requestClient.get = _client.get.bind(_client);
  requestClient.post = _client.post.bind(_client);
  requestClient.put = _client.put.bind(_client);
  requestClient.delete = _client.delete.bind(_client);
  requestClient.patch = _client.patch.bind(_client);
  requestClient.request = _client.request.bind(_client);
  requestClient.upload = _client.upload.bind(_client);

  return _client;
}
