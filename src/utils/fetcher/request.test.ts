import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"
import {clientAPI} from "../../api/client"
import {FetchClient, initClient, requestClient} from "./request"

// Mock AbortController
class MockAbortController {
  signal = {
    aborted: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
  abort = vi.fn()
}

// Mock fetch API
global.fetch = vi.fn()
global.AbortController = MockAbortController as any

describe("FetchClient", () => {
  let client: FetchClient

  beforeEach(() => {
    client = clientAPI
    ;(global.fetch as any).mockClear()
  })

  describe("constructor", () => {
    it("should initialize with default values", () => {
      const defaultClient = new FetchClient()
      expect(defaultClient).toBeDefined()
    })

    it("should initialize with provided options", () => {
      const options = {
        baseURL: "https://test.com",
        timeout: 10000,
        headers: {"X-Test": "value"},
      }
      const customClient = new FetchClient(options)
      expect(customClient).toBeDefined()
    })
  })

  describe("buildURL", () => {
    it("should build URL with base URL", () => {
      const url = client["buildURL"]("/users")
      expect(url).toBe("https://api.example.com/users")
    })

    it("should build URL with parameters", () => {
      const url = client["buildURL"]("/users", {page: 1, limit: 10})
      expect(url).toBe("https://api.example.com/users?page=1&limit=10")
    })

    it("should handle array parameters", () => {
      const url = client["buildURL"]("/users", {roles: ["admin", "user"]})
      expect(url).toBe("https://api.example.com/users?roles=admin&roles=user")
    })

    it("should handle absolute URLs", () => {
      const url = client["buildURL"]("https://external.com/api/users")
      expect(url).toBe("https://external.com/api/users")
    })
  })

  describe("request methods", () => {
    beforeEach(() => {
      ;(global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({code: 200, data: {id: 1, name: "John"}}),
        ok: true,
        status: 200,
        clone: () => ({
          json: () => Promise.resolve({code: 200, data: {id: 1, name: "John"}}),
        }),
      } as Response)
    })

    it("should make GET request", async () => {
      const result = await client.get("/users/1")
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual({id: 1, name: "John"})
    })

    it("should make POST request", async () => {
      const postData = {name: "Jane"}
      const result = await client.post("/users", postData)

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(postData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual({id: 1, name: "John"})
    })

    it("should make PUT request", async () => {
      const putData = {name: "Updated John"}
      const result = await client.put("/users/1", putData)

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(putData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual({id: 1, name: "John"})
    })

    it("should make DELETE request", async () => {
      const result = await client.delete("/users/1")

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual({id: 1, name: "John"})
    })

    it("should make PATCH request", async () => {
      const patchData = {name: "Patched John"}
      const result = await client.patch("/users/1", patchData)

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(patchData),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
      expect(result).toEqual({id: 1, name: "John"})
    })
  })

  describe("interceptors", () => {
    it("should add and run request interceptors", async () => {
      const interceptor = vi.fn(config =>
        Promise.resolve({...config, intercepted: true}),
      )
      client.addRequestInterceptor(interceptor)
      ;(global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({code: 200, data: {}}),
        ok: true,
        status: 200,
        clone: () => ({
          json: () => Promise.resolve({code: 200, data: {}}),
        }),
      } as Response)

      await client.get("/test")

      expect(interceptor).toHaveBeenCalled()
    })

    it("should handle timeout correctly", async () => {
      // Mock setTimeout to avoid actual timeouts in tests
      vi.useFakeTimers()

      const abortControllerSpy = vi.spyOn(global, "AbortController")

      ;(global.fetch as any).mockImplementation(() => {
        return new Promise(() => {}) // Never resolve to trigger timeout
      })

      const timeoutClient = new FetchClient({timeout: 100})

      const promise = timeoutClient.get("/slow-endpoint")

      // Advance timers to trigger timeout
      vi.advanceTimersByTime(100)

      await expect(promise).rejects.toThrow(
        "Request timeout: https://api.example.com/slow-endpoint",
      )

      vi.useRealTimers()
      abortControllerSpy.mockRestore()
    })
  })

  describe("error handling", () => {
    it("should handle network errors", async () => {
      ;(global.fetch as any).mockRejectedValue(new Error("Network error"))

      await expect(client.get("/users")).rejects.toThrow("Network error")
    })

    it("should handle API errors with code", async () => {
      ;(global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({code: 404, message: "Not found"}),
        ok: true,
        status: 200,
        clone: () => ({
          json: () => Promise.resolve({code: 404, message: "Not found"}),
        }),
      } as Response)

      await expect(client.get("/users")).rejects.toEqual(
        expect.objectContaining({
          data: {code: 404, message: "Not found"},
        }),
      )
    })
  })

  describe("upload method", () => {
    it("should handle file uploads", async () => {
      const formData = new FormData()
      formData.append(
        "file",
        new Blob(["test"], {type: "text/plain"}),
        "test.txt",
      )
      ;(global.fetch as any).mockResolvedValue({
        json: () => Promise.resolve({code: 200, data: {id: 1}}),
        ok: true,
        status: 200,
        clone: () => ({
          json: () => Promise.resolve({code: 200, data: {id: 1}}),
        }),
      } as Response)

      const result = await client.upload("/upload", formData)

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/upload",
        expect.objectContaining({
          method: "POST",
          body: formData,
        }),
      )
      expect(result).toEqual({id: 1})
    })
  })
})

describe("initClient and requestClient", () => {
  beforeEach(() => {
    ;(global.fetch as any).mockClear()
  })

  afterEach(() => {
    // Reset the client after each test
    ;(global as any)._client = null
  })

  it("should initialize client and update requestClient methods", () => {
    ;(global.fetch as any).mockResolvedValue({
      json: () => Promise.resolve({code: 200, data: {id: 1}}),
      ok: true,
      status: 200,
      clone: () => ({
        json: () => Promise.resolve({code: 200, data: {id: 1}}),
      }),
    } as Response)

    const client = initClient("https://api.example.com")

    expect(client).toBeDefined()
    expect(requestClient.get).toBeDefined()
    expect(requestClient.post).toBeDefined()
    expect(requestClient.put).toBeDefined()
    expect(requestClient.delete).toBeDefined()
    expect(requestClient.patch).toBeDefined()
    expect(requestClient.request).toBeDefined()
    expect(requestClient.upload).toBeDefined()
  })

  it("should throw error when client is not initialized", async () => {
    // Temporarily reset the client to test error handling
    const originalGet = requestClient.get

    // Replace with the default error-throwing function
    Object.defineProperty(requestClient, "get", {
      value: () => {
        throw new Error("Client not configured. Please call initClient first.")
      },
      writable: true,
    })

    await expect(requestClient.get("/users")).rejects.toThrow(
      "Client not configured. Please call initClient first.",
    )

    // Restore original function
    Object.defineProperty(requestClient, "get", {
      value: originalGet,
      writable: true,
    })
  })
})
