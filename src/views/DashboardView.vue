<template>
  <SelectorField :data="localItems" v-model="selectedItem" placeholder="Choose an option" labelField="name"
    :clearable="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SelectorField from '@/components/SelectorField.vue';

const localItems = [
  { Id: 1, name: 'Option One' },
  { Id: 2, name: 'Option Two' },
  { Id: 3, name: 'Option Three' }
]

const selectedItem = ref(null)
</script>
