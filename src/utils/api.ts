/**
 * API 호출 유틸리티 (순수 로직 레이어)
 *
 * 요청 단위로 AbortController를 사용합니다. 동시 요청이 서로를 취소하지 않습니다.
 * 컴포넌트에서 사용 시에는 hooks/useApi를 사용하면 언마운트 시 자동 중단됩니다.
 */

export interface ApiRequestOptions extends Omit<RequestInit, 'signal'> {
  timeout?: number
  /** 전달 시 이 signal이 abort되면 요청이 중단됨 (예: useApi 훅에서 주입) */
  signal?: AbortSignal
}

export class ApiError extends Error {
  status: number
  statusText: string

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `API Error: ${status} ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
  }
}

/**
 * 요청 하나마다 독립된 AbortController를 사용합니다.
 * options.signal이 있으면 해당 signal이 abort될 때 요청도 중단됩니다.
 */
export class ApiService {
  private baseURL: string

  constructor(baseURL = '') {
    this.baseURL = baseURL
  }

  async request<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const { timeout = 30000, signal: callerSignal, ...fetchOptions } = options

    const controller = new AbortController()
    const signal = controller.signal

    if (callerSignal) {
      if (callerSignal.aborted) {
        throw new DOMException('Aborted', 'AbortError')
      }
      callerSignal.addEventListener('abort', () => controller.abort())
    }

    const timeoutId =
      timeout > 0
        ? setTimeout(() => controller.abort(), timeout)
        : undefined

    try {
      const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url

      const response = await fetch(fullUrl, {
        ...fetchOptions,
        signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new ApiError(
          response.status,
          response.statusText,
          `Request failed: ${response.status} ${response.statusText}`
        )
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return (await response.json()) as T
      }

      return (await response.text()) as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error && error.name === 'AbortError') {
        throw error
      }
      if (error instanceof ApiError) {
        throw error
      }
      throw new Error(
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  async get<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  async post<T>(
    url: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(
    url: string,
    data?: unknown,
    options?: ApiRequestOptions
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(url: string, options?: ApiRequestOptions): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }
}

const baseURL: string =
  (typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL
    : '') || ''

/**
 * 기본 API 서비스 인스턴스 (VITE_API_BASE_URL 적용)
 */
export const apiService = new ApiService(baseURL)
