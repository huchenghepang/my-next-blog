import {
  configureClient,
  configureRefreshToken,
  initClient,
} from "../utils/fetcher/request"
let accessToken = "accessToken"
let refreshToken = "refreshToken"

// 1. 配置 token 管理函数
configureClient({
  getToken: () => accessToken,
  getRefresh: () => refreshToken,
  setToken: token => {
    if (token) {
      accessToken = token
    } else {
      accessToken = ""
    }
  },
  setRefresh: token => {
    if (token) {
      refreshToken = token
    } else {
      refreshToken = ""
    }
  },
  onLogout: () => {
    console.log("退出登录")
  },
  onMessage: (msg, type) => {
    // 显示消息提示
    console.log(`${type}: ${msg}`)
    // 可以使用 toast 组件
    // toast[type](msg)
  },
})

// 2. 配置刷新 token 的函数
configureRefreshToken(async () => {
  // 调用刷新 token 的 API
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  })

  const data = await response.json()
  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  }
})

// 3. 初始化客户端
export const clientAPI = initClient("https://api.huchenghe.site", {
  timeout: 10000,
  headers: {
    "X-App-Version": "1.0.0",
  },
});

clientAPI.addResponseInterceptor(async response => {
  const json = await response.json()
  if (json.code === 200 || json.code === 201) {
    if (json.data) {
      return json.data
    } else {
      return json
    }
  }
  return response
})
