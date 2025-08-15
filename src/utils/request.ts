import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios';

import { CustomErrorResponse, CustomResponse } from '../types/customResponse';
import { getLocalStorage, setLocalStorage } from './localStore';

/**
 * 请求工具类，用于封装 Axios 请求，支持 GET、POST 和通用请求方法。
 */
class Request {
    private instance: AxiosInstance;
    /**
     * 等待请求的队列
     */
    private pendingRequest: Map<any, { cancel?: () => void, retry?: (accessToken: string) => void }> = new Map();
    /**
     * 是否正在刷新 token
     */
    private isRefreshingToken: boolean = false;
    /**
     * 请求的取消 token
     */
    private cancelTokenSource: CancelTokenSource | null = null;

    constructor(config?: AxiosRequestConfig) {
        this.instance = axios.create({
            timeout: 3000,
            withCredentials: true,
            ...config,
        });

        // 注册拦截器
        this.instance.interceptors.request.use(this.requestInterceptor, error => Promise.reject(error));
        this.instance.interceptors.response.use(this.responseInterceptor, this.responseErrorInterceptor);
    }

    /** 请求拦截器 */
    private async requestInterceptor(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
        if (this.isRefreshingToken) {
            // 如果正在刷新 Token，将当前请求添加到队列
            return new Promise((resolve, reject) => {
                this.pendingRequest.set(config, {
                    cancel: () => reject('请求被取消'),
                    retry: (accessToken) => {
                        config.headers.Authorization = `Bearer ${accessToken}`;
                        resolve(config);
                    },
                });
            });
        }
        // 获取本地存储的 token
        if (!config.headers.Authorization) {
            const token = getLocalStorage("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // 创建取消 token
        if (this.cancelTokenSource) {
            config.cancelToken = this.cancelTokenSource.token;
        }

        return config;
    }

    /** 响应拦截器 */
    private responseInterceptor(response: AxiosResponse) {
        return response;
    }

    /** 错误处理拦截器 */
    private async responseErrorInterceptor(error: AxiosError<CustomErrorResponse>) {
        if (error.response) {
            const { response: { status, data }, config } = error;
            const errorMessage = data.errorMessage || '未知错误';
            // 打印错误信息
            console.error(`请求失败，状态码：${status}，错误信息：${errorMessage}`);
            const oldRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

            // 处理刷新token的逻辑
            if (status === 401 && !oldRequest._retry) {
                if (oldRequest.headers["X-Refresh-Token"]) {
                    return Promise.reject(new Error(errorMessage));
                }
                oldRequest._retry = true;
                if (!this.isRefreshingToken) {
                    this.isRefreshingToken = true;
                    // 这里可以添加刷新 token 的逻辑
                    const freshToken = getLocalStorage("refreshToken");
                    if (!freshToken) {
                        return Promise.reject(new Error(errorMessage));
                    }

                    try {
                        const { accessToken, refreshToken } = await this.refreshToken("/auth/refresh", freshToken);
                        setLocalStorage("token", accessToken);
                        setLocalStorage("refreshToken", refreshToken);
                        oldRequest.headers.Authorization = `Bearer ${accessToken}`;
                        this.pendingRequest.forEach((request) => {
                            if (request.retry) {
                                request.retry(accessToken);
                            }
                        });
                        this.pendingRequest.clear();
                        return this.instance(oldRequest);
                    } catch (error) {
                        return Promise.reject(new Error(errorMessage));
                    } finally {
                        this.isRefreshingToken = false;
                    }
                }
                return new Promise((resolve, reject) => {
                    this.pendingRequest.set(oldRequest, {
                        retry: (accessToken) => {
                            oldRequest.headers.Authorization = `Bearer ${accessToken}`;
                            resolve(this.instance(oldRequest));
                        }
                    });
                });
            }
            return Promise.reject(new Error(errorMessage));
        }

        let errorMessage: string | null = null;
        if (error instanceof AxiosError) {
            switch (error.code) {
                case AxiosError.ERR_NETWORK:
                    errorMessage = '网络错误，请检查您的网络连接！';
                    break;
                case AxiosError.ERR_INVALID_URL:
                    errorMessage = 'URL 格式不正确！';
                    break;
                case AxiosError.ERR_CANCELED:
                    errorMessage = '请求已被取消！';
                    break;
                case AxiosError.ECONNABORTED:
                    errorMessage = '连接中断';
                    break;
                case AxiosError.ETIMEDOUT:
                    errorMessage = '连接超时';
                    break;
                default:
                    errorMessage = '其他错误：' + error.message;
            }
        } else {
            errorMessage = '未知错误';
        }

        if (errorMessage) {
            error.message = errorMessage;
        }
        console.error(`请求失败，错误信息：${error.message}`);
        return Promise.reject(new Error(error.message));
    }

    async refreshToken(url: string, freshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        return (await this.post(url, {}, { headers: { Authorization: `Bearer ${freshToken}`, "X-Refresh-Token": true } })).data
    }

    /**
     * 发送一个 GET 请求
     */
    public async get<RD = unknown, RDI = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>) {
        return (await this.instance.get<CustomResponse<RD> & CustomErrorResponse & RD & RDI>(url, config)).data;
    }

    /**
     * 发送一个 POST 请求
     */
    public async post(url: string, data?: any, config?: any) {
        return (await this.instance.post(url, data, config)).data
    }

    /**
     * 发送一个 PUT 请求
     */
    public async put<RD = unknown, RDI = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        return (await this.instance.put<CustomResponse<RD> & CustomErrorResponse & RDI>(url, data, config)).data
    }

    /**
     * 发送一个 DELETE 请求
     */
    public async delete<RD = unknown, RDI = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>) {
        return (await this.instance.delete<CustomResponse<RD> & CustomErrorResponse & RDI>(url, config)).data
    }

    /**
     * 发送一个 PATCH 请求
     */
    public async patch<RD = unknown, RDI = unknown, D = unknown>(url: string, data: D, config?: AxiosRequestConfig<D>) {
        return (await this.instance.patch<CustomResponse<RD> & CustomErrorResponse & RDI>(url, data, config)).data
    }

    /**
     * 发送一个通用 HTTP 请求
     */
    public async Request<RD = unknown, RDI = unknown, D = unknown>(config: AxiosRequestConfig<D>) {
        return (await this.instance.request<CustomResponse<RD> & CustomErrorResponse & RDI>(config)).data;
    }

    /**
     * 取消当前请求
     */
    public cancelRequest() {
        if (this.cancelTokenSource) {
            this.cancelTokenSource.cancel('请求已被取消');
        }
    }

}

const request = new Request({
    baseURL: "/api"
});

export const reqPostAuthrefreshtoken = async (): Promise<{ accessToken: string, refreshToken: string }> => {
    return await request.post(`/api/auth/refresh`);
};
export default { request };
