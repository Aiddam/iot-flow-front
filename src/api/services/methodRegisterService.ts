import apiClient from '../index'
import { MethodRegisterResult } from '@/types/methodRegister/MethodRegisterResult';

export async function getMethodRegisterResult(deviceGuid: string, methodName: string): Promise<MethodRegisterResult> {
  const response = await apiClient.get(`/api/method-register/get-by-device/${deviceGuid}/${methodName}`)
  return response.data
}
