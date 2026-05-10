/**
 * Base Service - Clase base para todos los servicios
 * Proporciona funcionalidad común: fetch con autenticación, error handling, etc.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

/**
 * Opciones de configuración para una request
 */
interface RequestConfig {
  headers?: Record<string, string>
  body?: unknown
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
}

/**
 * Error personalizado con información de API
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Clase base para servicios
 * Proporciona métodos comunes para interactuar con la API
 */
export abstract class BaseService {
  protected apiUrl = API_URL

  /**
   * Obtener token de autenticación desde localStorage
   */
  protected getAuthToken(): string {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      throw new ApiError(401, 'No authentication token found')
    }
    return token
  }

  /**
   * Hacer una request a la API con manejo automático de autenticación y errores
   */
  protected async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const token = this.getAuthToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...config.headers,
    }

    const url = `${this.apiUrl}${endpoint}`

    const fetchConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
    }

    if (config.body) {
      fetchConfig.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, fetchConfig)

      // Parsear respuesta
      let data: unknown
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = await response.json()
      }

      // Si no es OK, lanzar error
      if (!response.ok) {
        throw new ApiError(
          response.status,
          (data as any)?.message || `HTTP ${response.status}`,
          data
        )
      }

      return data as T
    } catch (error) {
      // Si es ApiError, re-lanzar
      if (error instanceof ApiError) {
        throw error
      }

      // Si es error de red o parsing
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new ApiError(0, `Request failed: ${message}`, error)
    }
  }

  /**
   * GET request
   */
  protected async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST request
   */
  protected async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body })
  }

  /**
   * PATCH request
   */
  protected async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }

  /**
   * PUT request
   */
  protected async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  /**
   * DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}
