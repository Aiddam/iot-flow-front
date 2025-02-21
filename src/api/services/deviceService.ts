import { DevicePayload } from '@/types/device/DevicePayload'
import apiClient from '../index'
import { Device } from '@/types/device/Device';

export async function getDevices() {
  const response = await apiClient.get('/api/devices')
  return response.data
}
export async function updateDevice(device: DevicePayload, deviceGuid: string): Promise<Device> {
  const response = await apiClient.put(`/api/devices/${deviceGuid}`, device)
  return response.data
}
export async function createDevice(device: DevicePayload): Promise<Device> {
  const response = await apiClient.post('/api/devices/create', device)
  return response.data
}
export async function deleteDevice(deviceGuid: string): Promise<void> {
  const response = await apiClient.delete(`/api/devices/${deviceGuid}`)
  return response.data
}
