import apiClient from './axios'
import type { AxiosRequestConfig } from 'axios'

export const api = {
  get:    <T>(url: string, cfg?: AxiosRequestConfig) => apiClient.get<T>(url, cfg).then((r) => r.data),
  post:   <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => apiClient.post<T>(url, data, cfg).then((r) => r.data),
  put:    <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => apiClient.put<T>(url, data, cfg).then((r) => r.data),
  patch:  <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => apiClient.patch<T>(url, data, cfg).then((r) => r.data),
  delete: <T>(url: string, cfg?: AxiosRequestConfig) => apiClient.delete<T>(url, cfg).then((r) => r.data),
}
