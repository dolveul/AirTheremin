/**
 * API 호출을 위한 커스텀 훅
 *
 * 컴포넌트 생명주기에 묶인 AbortSignal을 모든 요청에 주입합니다.
 * 언마운트 시 해당 컴포넌트에서 시작한 요청이 자동으로 중단됩니다.
 */

import { useEffect, useMemo } from 'react'
import { apiService } from '../utils/api'
import type { ApiRequestOptions } from '../utils/api'

function useAbortSignal(): AbortSignal {
  const controller = useMemo(() => new AbortController(), [])

  useEffect(() => {
    return () => controller.abort()
  }, [controller])

  return controller.signal
}

/**
 * useApi()가 반환하는 API 클라이언트 타입
 */
export interface UseApiReturn {
  get: <T>(url: string, options?: ApiRequestOptions) => Promise<T>
  post: <T>(
    url: string,
    data?: unknown,
    options?: ApiRequestOptions
  ) => Promise<T>
  put: <T>(
    url: string,
    data?: unknown,
    options?: ApiRequestOptions
  ) => Promise<T>
  delete: <T>(url: string, options?: ApiRequestOptions) => Promise<T>
}

export function useApi(): UseApiReturn {
  const signal = useAbortSignal()

  return useMemo(
    (): UseApiReturn => ({
      get: (url, options) =>
        apiService.get(url, { ...options, signal: options?.signal ?? signal }),
      post: (url, data, options) =>
        apiService.post(url, data, {
          ...options,
          signal: options?.signal ?? signal,
        }),
      put: (url, data, options) =>
        apiService.put(url, data, {
          ...options,
          signal: options?.signal ?? signal,
        }),
      delete: (url, options) =>
        apiService.delete(url, { ...options, signal: options?.signal ?? signal }),
    }),
    [signal]
  )
}
