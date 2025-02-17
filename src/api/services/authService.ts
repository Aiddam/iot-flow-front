import { RegisterPayload } from '@/types/auth/RegisterPayload'
import apiClient from '../index'
import { RegisterResponse } from '@/types/auth/RegisterResponse'
import { LoginPayload } from '@/types/auth/LoginPayload'

export async function registerUser (payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await apiClient.post('/api/jwt-auth/register', payload)
  return response.data
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post('/api/jwt-auth/login', payload)
  return response.data
}

export async function getUser() {
  const response = await apiClient.get('/api/jwt-auth/me')
  return response.data
}
