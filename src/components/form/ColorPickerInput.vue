<script setup lang="ts">

import {useModelWrapper} from "@/composables/modelWrapper";

defineProps(['modelValue','label'])
defineEmits(['update:modelValue'])
const value = useModelWrapper<any>();
</script>

<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-right="40"
    offset-y

  >
    <template v-slot:activator="{ props }">
      <v-text-field :value="value" :label = "label" :model-value="value" v-bind="props">
        <template v-slot:prepend-inner>
          <v-icon icon="mdi-circle" :color="value"></v-icon>
        </template>
      </v-text-field>
    </template>
    <v-color-picker v-model="value"/>
  </v-menu>
</template>

<style scoped>

</style>
