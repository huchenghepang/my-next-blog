export interface RequestConfig extends RequestInit {
  url?: string
  params?: Record<string, any>
  timeout?: number
  __isRetryRequest?: boolean
}

export interface ApiResponse<T = any> {
  code: number
  data: T
  message?: string
}

export interface RequestClientOptions {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  onUnauthorized?: () => void
}

// ==================== Fetch 客户端类 ====================

export class FetchClient {
  private baseURL: string
  private defaultConfig: RequestInit
  private timeout: number
  private onUnauthorized?: () => void
  private onRefreshToken?: () => Promise<string>
  private requestInterceptors: Array<
    (config: RequestConfig) => Promise<RequestConfig>
  > = []
  private responseInterceptors: Array<(response: Response) => Promise<any>> = []
  private responseErrorInterceptors: Array<(error: any) => Promise<any>> = []

  constructor(options: RequestClientOptions = {}) {
    this.baseURL = options.baseURL || ""
    this.timeout = options.timeout || 30000
    this.onUnauthorized = options.onUnauthorized
    this.defaultConfig = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(
    interceptor: (config: RequestConfig) => Promise<RequestConfig>,
  ): void {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(
    onFulfilled?: (response: Response) => Promise<any>,
    onRejected?: (error: any) => Promise<any>,
  ): void {
    if (onFulfilled) {
      this.responseInterceptors.push(onFulfilled)
    }
    if (onRejected) {
      this.responseErrorInterceptors.push(onRejected)
    }
  }

  /**
   * 执行请求拦截器
   */
  private async runRequestInterceptors(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    let result = config
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result)
    }
    return result
  }

  /**
   * 执行响应拦截器
   */
  private async runResponseInterceptors<T>(response: Response): Promise<T> {
    let result = response
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result)
    }
    return result as T
  }

  /**
   * 执行错误拦截器
   */
  private async runResponseErrorInterceptors(error: any): Promise<any> {
    let result = error
    for (const interceptor of this.responseErrorInterceptors) {
      try {
        result = await interceptor(result)
      } catch (e) {
        result = e
      }
    }
    throw result
  }

  /**
   * 构建完整 URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    // 标准化 baseURL 和 url 的斜杠
    const base = this.baseURL.endsWith("/")
      ? this.baseURL.slice(0, -1)
      : this.baseURL
    const path = url.startsWith("/") ? url : `/${url}`
    const fullURL = url.startsWith("http") ? url : `${base}${path}`

    if (!params) return fullURL

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${fullURL}?${queryString}` : fullURL
  }

  /**
   * 带超时的 fetch
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number = this.timeout,
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout: ${url}`)
      }
      throw error
    }
  }

  /**
   * 核心请求方法
   */
  async request<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
    try {
      // 合并配置
      let mergedConfig: RequestConfig = {
        ...this.defaultConfig,
        ...config,
        headers: {
          ...this.defaultConfig.headers,
          ...config.headers,
        },
      }

      // 处理 params
      const {params, timeout = this.timeout, ...restConfig} = mergedConfig
      const fullURL = this.buildURL(url, params)

      // 执行请求拦截器
      mergedConfig = await this.runRequestInterceptors({
        ...restConfig,
        url: fullURL,
      } as RequestConfig)

      // 发起请求
      const response = await this.fetchWithTimeout(
        fullURL,
        mergedConfig,
        timeout,
      )

      // 执行响应拦截器
      const result = await this.runResponseInterceptors<T>(response)
      console.log("Response:", result)

      return result as T
    } catch (error) {
      // 执行错误拦截器
      throw await this.runResponseErrorInterceptors(error)
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {...config, method: "GET"})
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {...config, method: "DELETE"})
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * 上传文件
   */
  async upload<T = any>(
    url: string,
    formData: FormData,
    config: RequestConfig & {
      headers?: {
        "Content-Type": undefined | string
      }
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
    })
  }
}

// ==================== 创建客户端实例 ====================

// 获取 token 的函数（需要外部实现）
let getAccessToken: () => string | null = () => null
let getRefreshToken: () => string | null = () => null
let setAccessToken: (token: string | null) => void = () => {}
let setRefreshToken: (token: string | null) => void = () => {}
let logout: () => void = () => {}
let showMessage: (
  msg: string,
  type?: "success" | "error" | "warning",
) => void = msg => {
  console.log(msg)
}

export function configureClient({
  getToken,
  getRefresh,
  setToken,
  setRefresh,
  onLogout,
  onMessage,
}: {
  getToken: () => string | null
  getRefresh: () => string | null
  setToken: (token: string | null) => void
  setRefresh: (token: string | null) => void
  onLogout: () => void
  onMessage: (msg: string, type?: "success" | "error" | "warning") => void
}) {
  getAccessToken = getToken
  getRefreshToken = getRefresh
  setAccessToken = setToken
  setRefreshToken = setRefresh
  logout = onLogout
  showMessage = onMessage
}

// 刷新 token 的函数（需要外部实现）
let refreshTokenFn: () => Promise<{
  accessToken: string
  refreshToken: string
}> = async () => {
  throw new Error("refreshToken function not configured")
}

export function configureRefreshToken(
  fn: () => Promise<{accessToken: string; refreshToken: string}>,
) {
  refreshTokenFn = fn
}

// 创建请求客户端
export function createRequestClient(
  baseURL: string,
  options?: RequestClientOptions,
) {
  const client = new FetchClient({
    baseURL,
    ...options,
  })

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn("Access token or refresh token is invalid or expired.")
    setAccessToken(null)
    setRefreshToken(null)
    logout()
  }

  /**
   * 刷新 token 逻辑
   */
  async function doRefreshToken() {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error("Refresh token is empty.")
    }

    try {
      const {accessToken, refreshToken: newRefreshToken} =
        await refreshTokenFn()
      setAccessToken(accessToken)
      setRefreshToken(newRefreshToken)
      return accessToken
    } catch (error) {
      await doReAuthenticate()
      throw error
    }
  }

  function formatToken<T = string | undefined>(token: T): string {
    return token ? `Bearer ${token}` : ""
  }

  // 请求拦截器：添加认证头
  client.addRequestInterceptor(async config => {
    const isRefreshRequest = config.url?.includes("/auth/refresh")

    if (isRefreshRequest) {
      const refreshToken = getRefreshToken() || ""

      config.headers = {
        ...config.headers,
        Authorization: formatToken(refreshToken),
      }

      config.__isRetryRequest = true
    } else {
      const accessToken = getAccessToken() || ""

      config.headers = {
        ...config.headers,
        Authorization: formatToken(accessToken),
      }
    }

    return config
  })

  // 响应拦截器：通用错误处理
  client.addResponseInterceptor(
    async (response: Response) => {
      return response
    },
    async (error: any) => {
      let errorMessage = ""

      if (error.response) {
        const responseData = error.data || {}
        errorMessage =
          responseData?.message || responseData?.msg || responseData?.error

        if (!errorMessage) {
          const status = error.response.status
          switch (status) {
            case 400:
              errorMessage = "请求参数错误"
              break
            case 401:
              errorMessage = "未授权，请重新登录"
              break
            case 403:
              errorMessage = "拒绝访问"
              break
            case 404:
              errorMessage = "请求资源不存在"
              break
            case 500:
              errorMessage = "服务器内部错误"
              break
            case 502:
              errorMessage = "网关错误"
              break
            case 503:
              errorMessage = "服务不可用"
              break
            case 504:
              errorMessage = "网关超时"
              break
            default:
              errorMessage = `请求失败: ${status}`
          }
        }
      } else if (error.message) {
        errorMessage = error.message
      } else if (typeof error === "string") {
        errorMessage = error
      } else {
        errorMessage = "网络请求失败"
      }

      // 显示错误消息
      showMessage(errorMessage, "error")

      throw error
    },
  )

  return client
}

// ==================== 导出默认实例 ====================

// 定义客户端接口
export interface IRequestClient {
  get: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  post: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  put: <T = any>(url: string, data?: any, config?: RequestConfig) => Promise<T>
  delete: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  patch: <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ) => Promise<T>
  request: <T = any>(url: string, config?: RequestConfig) => Promise<T>
  upload: <T = any>(
    url: string,
    data?: any,
    config?: RequestConfig & {
      headers?: Record<"Content-Type", string>
    },
  ) => Promise<T>
}

// 创建未初始化的客户端
let _client: FetchClient | null = null

// 导出客户端对象，初始时所有方法都抛出错误
export const requestClient: IRequestClient = {
  get: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
  post: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
  put: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
  delete: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
  patch: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
  request: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
  upload: () => {
    throw new Error("Client not configured. Please call initClient first.")
  },
}

// 初始化客户端
export function initClient(baseURL: string, options?: RequestClientOptions) {
  _client = createRequestClient(baseURL, options)

  requestClient.get = _client.get.bind(_client)
  requestClient.post = _client.post.bind(_client)
  requestClient.put = _client.put.bind(_client)
  requestClient.delete = _client.delete.bind(_client)
  requestClient.patch = _client.patch.bind(_client)
  requestClient.request = _client.request.bind(_client)
  requestClient.upload = _client.upload.bind(_client)

  return _client
}
