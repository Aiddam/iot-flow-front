<template>
  <div class="devices">
    <h1>Current devices</h1>
    <div class="actions">
      <Button label="Create Device" icon="pi pi-plus" @click="onCreateClick" class="p-mb-3" />
    </div>

    <DataTable :value="devices" tableStyle="min-width: 50rem" selectionMode="single" v-model:selection="selectedDevice"
      paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" scrollable scrollHeight="550px"
      @row-dblclick="onRowDblClick">
      <Column field="name" header="Name"></Column>
      <Column field="deviceGuid" header="GUID"></Column>
      <Column header="Last Seen At">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.lastSeen) }}
        </template>
      </Column>
      <Column header="Is Alive">
        <template #body="slotProps">
          <RadioButton v-model="slotProps.data.isAlive" :value="true" disabled class="p-mr-2" />
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="action-buttons">
            <Button class="custom-icon-btn p-mr-2" @click="onDeleteDevice(slotProps.data)" aria-label="delete">
              <img src="/icons/delete.ico" alt="delete" class="icon-image" />
            </Button>
            <Button class="custom-icon-btn" @click="onRebootDevice(slotProps.data)" aria-label="reboot">
              <img src="/icons/reboot.ico" alt="reboot" class="icon-image" />
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog :header="isEditMode ? 'Edit device' : 'Create device'" v-model:visible="displayDialog" modal
      :closable="false" style="width: 22rem">
      <div v-if="editableDevice">
        <div class="field" v-if="isEditMode">
          <label for="deviceGuid">GUID</label>
          <InputText id="deviceGuid" v-model="editableDevice.deviceGuid" disabled style="width: 100%" />
        </div>
        <div class="field">
          <label for="name">Name</label>
          <InputText id="name" v-model="editableDevice.name" style="width: 100%" />
          <small v-if="editableDevice.name && !isNameValid" class="error">Name має містити не менше 3 символів</small>
        </div>
      </div>
      <template #footer>
        <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-secondary" />
        <Button label="Save And Close" icon="pi pi-check" @click="saveDevice" class="p-button-success"
          :disabled="!isModified || !isNameValid" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import RadioButton from 'primevue/radiobutton'
import { getDevices, updateDevice, createDevice, deleteDevice } from '@/api/services/deviceService'
import { Device } from '@/types/device/Device'
import { DevicePayload } from '@/types/device/DevicePayload'

const devices = ref<Device[]>([])
const selectedDevice = ref<Device | null>(null)
const displayDialog = ref(false)
const isEditMode = ref(true)

const editableDevice = reactive<Device>({
  deviceGuid: '',
  name: ''
})

const originalDevice = ref<Device | null>(null)

const fetchDevices = async () => {
  try {
    devices.value = await getDevices()
  } catch (error) {
    console.error('Помилка при отриманні девайсів:', error)
  }
}

const formatDate = (dateValue: Date | string | null): string => {
  if (!dateValue) return ''
  const date = new Date(dateValue)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const isModified = computed(() => {
  if (!originalDevice.value) return false
  return JSON.stringify(editableDevice) !== JSON.stringify(originalDevice.value)
})

const isNameValid = computed(() => {
  return editableDevice.name && editableDevice.name.trim().length >= 3
})

const onRowDblClick = (event: { data: Device }) => {
  isEditMode.value = true
  Object.assign(editableDevice, event.data)
  originalDevice.value = JSON.parse(JSON.stringify(event.data))
  displayDialog.value = true
}

const onCreateClick = () => {
  isEditMode.value = false
  editableDevice.deviceGuid = ''
  editableDevice.name = ''
  originalDevice.value = { deviceGuid: '', name: '' }
  displayDialog.value = true
}

const closeDialog = () => {
  displayDialog.value = false
  selectedDevice.value = null
}

const saveDevice = async () => {
  try {
    const payload: DevicePayload = { name: editableDevice.name }
    if (isEditMode.value) {
      await updateDevice(payload, editableDevice.deviceGuid)
    } else {
      await createDevice(payload)
    }
    await fetchDevices()
    closeDialog()
  } catch (error) {
    console.error('Error when saving a device:', error)
  }
}
const onDeleteDevice = async (device: Device) => {
  try {
    await deleteDevice(device.deviceGuid)
    await fetchDevices()
  } catch (error) {
    console.error('Error when deleteing a device:', error)
  }
}

const onRebootDevice = async (device: Device) => {
  try {
    console.log("rebootDevice", device.deviceGuid)
    await fetchDevices()
  } catch (error) {
    console.error('Error when reloading a device:', error)
  }
}

onMounted(() => {
  fetchDevices()
})
</script>

<style scoped>
.devices {
  padding: 20px;
}

.actions {
  margin-bottom: 1rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.error {
  color: red;
  font-size: 0.8rem;
}

.custom-icon-btn {
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  min-width: 0;
}

.action-buttons .custom-icon-btn+.custom-icon-btn {
  margin-left: 8px;
}

.icon-image {
  width: 20px;
  height: 20px;
}
</style>
