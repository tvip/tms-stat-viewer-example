<script setup lang="ts">
  import dayjs from "dayjs";
  import {useModelWrapper} from "@/composables/modelWrapper";

  const props = defineProps<{
    date: Date|null,
    label: string,
    clearable?:boolean,
    min?:Date|null,
    max?:Date|null
  }>()
  const emit = defineEmits(['update:date'])
  const date = useModelWrapper<Date|null>('date')
  function dateDisplay(){
    return date.value ? dayjs(date.value).format('DD.MM.YYYY'):null
  }
</script>

<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-right="40"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        :label="label"
        :model-value="date"
        v-bind="props"
        :value="dateDisplay()"
      >
        <template v-if="clearable" v-slot:append-inner>
          <v-btn density="compact" size="small" icon="mdi-close" @click="date=null"></v-btn>
        </template>
      </v-text-field>
    </template>
  <v-date-picker :max="max?max:null" :min="min?min:null" v-model="date"/>
  </v-menu>
</template>

<style scoped>

</style>
