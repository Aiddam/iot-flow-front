<template>
  <div class="selector" ref="selectorRef">
    <div class="selector-input">
      <input type="text" v-model="searchText" @focus="openDropdown" @click.stop :placeholder="placeholder"
        class="selector-input-field" />
      <span v-if="clearable && searchText" class="clear-btn" @click.stop="clearSelection">×</span>
      <span class="arrow" @click.stop="toggleDropdown">
        {{ isOpen ? '▲' : '▼' }}
      </span>
    </div>
    <ul v-if="isOpen" class="dropdown-list">
      <li v-for="item in filteredItems" :key="item.Id"
        :class="{ selected: selectedItem && selectedItem.Id === item.Id }" @click.stop="selectItem(item)">
        {{ getItemLabel(item) }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, defineProps, defineEmits } from 'vue'
import apiClient from '@/api'

interface Item {
  Id: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const props = defineProps<{
  data?: Item[],
  url?: string,
  placeholder?: string,
  modelValue?: Item | null,
  labelField?: string,
  clearable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Item | null): void;
}>()

const items = ref<Item[]>([])
const isOpen = ref(false)
const selectedItem = ref<Item | null>(props.modelValue ?? null)
const searchText = ref<string>(
  selectedItem.value ? getItemLabel(selectedItem.value) : ''
)
const selectorRef = ref<HTMLElement | null>(null)

const placeholder = computed(() => props.placeholder || 'Select an item')

function getItemLabel(item: Item): string {
  return props.labelField ? item[props.labelField] : (item.name || item.Id.toString())
}

const filteredItems = computed(() => {
  if (selectedItem.value && searchText.value === getItemLabel(selectedItem.value)) {
    return items.value
  }
  const query = searchText.value.trim().toLowerCase()
  if (query === '') {
    return items.value
  }
  return items.value.filter(item =>
    getItemLabel(item).toLowerCase().includes(query)
  )
})

function openDropdown() {
  isOpen.value = true
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectItem(item: Item) {
  selectedItem.value = item
  searchText.value = getItemLabel(item)
  emit('update:modelValue', item)
  isOpen.value = false
}

function clearSelection() {
  selectedItem.value = null
  searchText.value = ''
  emit('update:modelValue', null)
}

async function fetchItems() {
  if (props.url) {
    try {
      const response = await apiClient.get(props.url)
      items.value = response.data
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }
}

onMounted(() => {
  if (props.data) {
    items.value = props.data
  } else if (props.url) {
    fetchItems()
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  if (selectorRef.value && !selectorRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    selectedItem.value = newVal ?? null
    searchText.value = newVal ? getItemLabel(newVal) : ''
  }
)
</script>

<style scoped>
.selector {
  position: relative;
  display: inline-block;
  width: 240px;
  font-family: sans-serif;
}

.selector-input {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 6px 8px;
  border-radius: 4px;
}

.selector-input-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
}

.clear-btn {
  cursor: pointer;
  font-size: 16px;
  color: #888;
  margin-right: 8px;
  user-select: none;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #333;
}

.arrow {
  cursor: pointer;
  font-size: 12px;
  user-select: none;
}

.dropdown-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  background: #fff;
  max-height: 220px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  margin: 0;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.dropdown-list li {
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-list li:hover {
  background-color: #f5f5f5;
}

.dropdown-list li.selected {
  background-color: #e6f7ff;
  font-weight: 500;
}
</style>
