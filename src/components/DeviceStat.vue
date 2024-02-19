<script setup lang="ts">
import {ref} from "vue";
import {useDeviceStore} from "@/store/device";
import DeviceEntity from "@/model/DeviceEntity";
import dayjs from "dayjs";
import {useLocale} from "vuetify";
const { t } = useLocale()
const deviceStore = useDeviceStore();

const props = defineProps(['range','provider'])
const loading = ref<boolean>(false);

const deviceEntities = ref<DeviceEntity[]>([]);
const showHours = ref<boolean>(false);

const deviceTableHeaders = ref([
  { title: t('app.device.class'), key: 'class' },
  { title: t('app.device.dvr_hours'), key: 'dvr_hours' },
  { title: t('app.device.live_hours'), key: 'live_hours' },
  { title: t('app.device.unique_devices'), key: 'unique_devices' },
])


function load(){
  console.dir(props);
  deviceStore.getDeviceStat(props.range, props.provider).then((devices: DeviceEntity[])=>{
    deviceEntities.value = devices;
    console.dir(devices);
    loading.value = false;
  })
}
defineExpose({load})


</script>

<template>
  <v-progress-linear indeterminate color="yellow-darken-2" v-if="loading"></v-progress-linear>
  <v-checkbox v-model="showHours" :label="$t('app.query.showHours')"></v-checkbox>

  <v-data-table
    :headers="deviceTableHeaders"
    :items="deviceEntities"
  >
    <template v-if="!showHours" v-slot:[`item.live_hours`]="{value}">
      {{dayjs.duration(value,'hours').format('YYYY [year] MM [month] DD [days] HH [hours] mm [minutes]')}}
    </template>
    <template v-if="!showHours" v-slot:[`item.dvr_hours`]="{value}">
      {{dayjs.duration(value,'hours').format('YYYY [year] MM [month] DD [days] HH [hours] mm [minutes]')}}
    </template>
  </v-data-table>
</template>

<style scoped>

</style>
