import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

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
