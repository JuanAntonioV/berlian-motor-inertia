import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const unauthorizedCode = 401
    const isAuthError = error.response.status === unauthorizedCode

    if (isAuthError) {
      localStorage.removeItem('token')
    }

    return Promise.reject(error.response.data)
  }
)
