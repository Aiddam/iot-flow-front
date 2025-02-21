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
      :closable="false" style="width: 40rem">
      <div v-if="editableDevice">
        <div class="field" v-if="isEditMode">
          <label for="deviceGuid">GUID</label>
          <InputText id="deviceGuid" v-model="editableDevice.deviceGuid" disabled style="width: 100%" />
        </div>
        <div class="field">
          <label for="name">Name</label>
          <InputText id="name" v-model="editableDevice.name" style="width: 100%" />
          <small v-if="editableDevice.name && !isNameValid" class="error">
            Name must contain at least 3 characters
          </small>
        </div>
        <div class="field" v-if="isEditMode && editableDevice.methods && editableDevice.methods.length">
          <label>Methods</label>
          <DataTable :value="editableDevice.methods" tableStyle="min-width: 20rem" scrollable scrollHeight="200px"
            selectionMode="single" v-model:selection="selectedMethodForCommand">
            <Column field="methodName" header="Method Name"></Column>
            <Column field="description" header="Description"></Column>
            <Column header="Type">
              <template #body="slotProps">
                {{ methodTypeToString(slotProps.data.methodType) }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <template #footer>
        <Button label="Close" icon="pi pi-times" @click="closeDialog" class="p-button-secondary" />
        <Button label="SendCommand" icon="pi pi-send" @click="onSendCommandClick" class="p-button-warning"
          v-if="isEditMode" />
        <Button label="Save And Close" icon="pi pi-check" @click="saveDevice" class="p-button-success"
          :disabled="!isModified || !isNameValid" />
      </template>
    </Dialog>

    <Dialog header="Send Command" v-model:visible="displayCommandDialog" modal :closable="false" style="width: 30rem">
      <div>
        <div v-if="selectedMethod && selectedMethod.parameters && selectedMethod.parameters.length">
          <label>Parameters</label>
          <div v-for="(param, index) in selectedMethod.parameters" :key="index" class="field">
            <label :for="'param-' + index">{{ param.parametrName }} ({{ param.type }})</label>
            <InputText v-if="param.type === ParameterType.String" :id="'param-' + index"
              v-model="commandParameters[param.parametrName]" style="width: 100%" />
            <InputText v-else-if="param.type === ParameterType.Int" :id="'param-' + index"
              v-model.number="commandParameters[param.parametrName]" style="width: 100%" />
            <InputSwitch v-else-if="param.type === ParameterType.Bool" :id="'param-' + index"
              v-model="commandParameters[param.parametrName]" />
            <InputText v-else :id="'param-' + index" v-model="commandParameters[param.parametrName]"
              style="width: 100%" />
          </div>
        </div>
        <div v-else>
          <p>The selected method has no parameters.</p>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" @click="closeCommandDialog" class="p-button-secondary" />
        <Button label="Send" icon="pi pi-check" @click="sendCommand" :disabled="!selectedMethod" />
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
import InputSwitch from 'primevue/inputswitch'
import { getDevices, updateDevice, createDevice, deleteDevice, sendDeviceCommand } from '@/api/services/deviceService'
import { Device } from '@/types/device/Device'
import { DevicePayload } from '@/types/device/DevicePayload'
import { MethodPayload } from '@/types/device/MethodPayload'
import { ParametrPayload } from '@/types/device/ParamertPayload'
import { MethodType } from '@/types/enums/MethodType'
import { ParameterType } from '@/types/enums/ParameterType'

const devices = ref<Device[]>([])
const selectedDevice = ref<Device | null>(null)
const displayDialog = ref(false)
const isEditMode = ref(true)


const editableDevice = reactive<Device>({
  deviceGuid: '',
  name: '',
  methods: []
})

const originalDevice = ref<Device | null>(null)

const fetchDevices = async () => {
  try {
    devices.value = await getDevices()
    console.log(devices.value)
  } catch (error) {
    console.error('Error when receiving devices:', error)
  }
}

const methodTypeToString = (type: number): string => {
  switch (type) {
    case MethodType.Void: return "Void";
    case MethodType.Int: return "Int";
    case MethodType.String: return "String";
    default: return "Unknown";
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
  editableDevice.methods = []
  originalDevice.value = { deviceGuid: '', name: '', methods: [] }
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
    console.log('rebootDevice', device.deviceGuid)
    await fetchDevices()
  } catch (error) {
    console.error('Error when reloading a device:', error)
  }
}

const selectedMethodForCommand = ref<MethodPayload | null>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commandParameters = reactive<Record<string, any>>({})
const selectedMethod = ref<MethodPayload | null>(null)
const displayCommandDialog = ref(false)

const onSendCommandClick = () => {
  if (!selectedMethodForCommand.value) {
    alert('Please select the method from the table you want to execute.')
    return
  }
  selectedMethod.value = selectedMethodForCommand.value
  // Обнуляємо параметри
  for (const key in commandParameters) {
    delete commandParameters[key]
  }
  if (selectedMethod.value.parameters && selectedMethod.value.parameters.length) {
    displayCommandDialog.value = true
  } else {
    sendCommand()
  }
}

const closeCommandDialog = () => {
  displayCommandDialog.value = false
}

const sendCommand = async () => {
  if (!editableDevice.deviceGuid || !selectedMethod.value) return
  const parametersArray = selectedMethod.value.parameters.map((param: ParametrPayload) => ({
    parametrName: param.parametrName,
    type: param.type,
    value: commandParameters[param.parametrName]
  }))
  const payload: MethodPayload = {
    methodName: selectedMethod.value.methodName,
    parameters: parametersArray
  }
  try {
    const response = await sendDeviceCommand(editableDevice.deviceGuid, payload)
    console.log('Command sent', response.data)
    displayCommandDialog.value = false
  } catch (error) {
    console.error('Error sending command:', error)
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
