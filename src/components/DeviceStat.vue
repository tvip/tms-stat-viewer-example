<script setup lang="ts">
import {ref} from "vue";
import {useDeviceStore} from "@/store/device";
import DeviceEntity, {DeviceDayStat} from "@/model/DeviceEntity";
import dayjs from "dayjs";
import {useLocale} from "vuetify";
import {AxiosError} from "axios";
import {ChartDateSeries} from "@/interface/ChartDateSeries";
import {useLogStore} from "@/store/log";
import {download, generateCsv, mkConfig} from "export-to-csv";

const { t } = useLocale()
const deviceStore = useDeviceStore();
const logStore = useLogStore();

const props = defineProps(['range','provider'])
const loading = ref<boolean>(false);

const deviceEntities = ref<DeviceEntity[]>([]);
const showHours = ref<boolean>(false);

const deviceChartKeys = [
  'unique_devices' as keyof DeviceDayStat,
  'live_hours' as keyof DeviceDayStat,
  'dvr_hours' as keyof DeviceDayStat,
]
const deviceChartKey = ref<keyof DeviceDayStat>(deviceChartKeys[0]);
const deviceChartSeries = ref<ChartDateSeries[]>([]);
const deviceChartOptions = {
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  }
};

const deviceTableHeaders = ref([
  { title: t('app.device.class'), key: 'name' },
  { title: t('app.device.dvr_hours'), key: 'dvr_hours' },
  { title: t('app.device.live_hours'), key: 'live_hours' },
  { title: t('app.device.unique_devices'), key: 'unique_devices' },
])

function periodSuffix(): string{
  return dayjs(props.range[0]).format('YYYY-MM-DD') + '_' + dayjs(props.range[props.range.length-1]).format('YYYY-MM-DD');
}

function makeDeviceChart(value: keyof DeviceDayStat){
  deviceChartSeries.value = deviceEntities.value.map((device: DeviceEntity)=>{
    const series: ChartDateSeries = {name: device.name, data: []};
    props.range.forEach((date: Date)=>{
      series.data.push({x: date, y: (device.getStatDay(date)[value] as number)});
    });
    return series;
  });
}

function load(){
  loading.value = true;
  deviceChartSeries.value = [];
  logStore.addLog('erase old device stat');
  deviceStore.getDeviceStat(props.range, props.provider).then((devices: DeviceEntity[])=>{
    deviceEntities.value = devices;
    makeDeviceChart(deviceChartKey.value);
    loading.value = false;
  }).catch((error: AxiosError)=>{
    console.dir(error);
    loading.value = false;
  })
}

/**
 * Summary table: one row per device class for the whole period.
 */
function downloadCsv(){
  const config = mkConfig({useKeysAsHeaders: true, filename: 'device-stat_' + periodSuffix()})
  const csv = generateCsv(config)(deviceEntities.value.map((value: DeviceEntity)=>{
    return {
      class: value.name,
      dvr_hours: value.dvr_hours,
      live_hours: value.live_hours,
      unique_devices: value.unique_devices
    };
  }))
  download(config)(csv);
}

/**
 * Daily table of the selected metric: one row per day, one column per device class
 * (the same layout as the "Daily device usage" export of tms-stat-view).
 */
function downloadDailyCsv(){
  const config = mkConfig({useKeysAsHeaders: true, filename: 'device-daily-' + deviceChartKey.value + '_' + periodSuffix()})
  const csv = generateCsv(config)(props.range.map((date: Date)=>{
    const row: Record<string, string|number> = {date: dayjs(date).format('YYYY-MM-DD')};
    deviceEntities.value.forEach((device: DeviceEntity)=>{
      row[device.name] = device.getStatDay(date)[deviceChartKey.value] as number;
    });
    return row;
  }))
  download(config)(csv);
}

defineExpose({load})
load();
</script>

<template>
  <v-progress-linear indeterminate :height="12" color="yellow-darken-2" v-if="loading">
    Don't panic, loading freeze is not equal fail, please have patience and wait
  </v-progress-linear>

  <div v-if="!loading">
  <v-card>
    <v-card-title>
      <v-select @update:modelValue="makeDeviceChart" v-model="deviceChartKey" :items="deviceChartKeys">
        <template v-slot:item="{props, item}">
          <v-list-item v-bind="props" :title="$t('app.device.dayStat.'+ item.raw)">
          </v-list-item>
        </template>
        <template v-slot:selection = "{item}">
          {{ $t('app.device.dayStat.'+item.raw) }}
        </template>
      </v-select>
    </v-card-title>
    <v-card-text>
      <h3>{{$t('app.device.usage')}}</h3>
      <div style="width: 100%; height: 500px;">
        <apexchart height="500px" type="line" :options="deviceChartOptions" :series="deviceChartSeries"></apexchart>
      </div>
      <v-btn prepend-icon="mdi-file-delimited" @click="downloadDailyCsv">{{$t('app.common.export_csv')}}</v-btn>
    </v-card-text>
  </v-card>
  <v-card>
    <v-card-title>{{$t('app.device.report.title')}} {{$t('app.device.report.to_period')}} {{dayjs(range[0]).format('DD.MM.YYYY')}} - {{dayjs(range[range.length-1]).format('DD.MM.YYYY')}} </v-card-title>
    <v-card-text>
      <v-checkbox v-model="showHours" :label="$t('app.query.showHours')"></v-checkbox>
      <v-btn prepend-icon="mdi-file-delimited" @click="downloadCsv">{{$t('app.common.export_csv')}}</v-btn>
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
    </v-card-text>
  </v-card>
  </div>
</template>

<style scoped>

</style>
