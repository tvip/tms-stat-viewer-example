<script setup lang="ts">

import dayjs from "dayjs";
import ChannelEntity, {DayStat} from "@/model/ChannelEntity";
import {ref} from "vue";
import {ChartDateSeries} from "@/interface/ChartDateSeries";
import {ChannelsDayStat, useChannelStore} from "@/store/channel";
import {useLocale} from "vuetify";
import {useLogStore} from "@/store/log";
import {AxiosError} from "axios";
const channelStore = useChannelStore();
const { t } = useLocale()
const channelEntities = ref<ChannelEntity[]>( []);
const props = defineProps(['range','provider','threshold'])
const loading = ref<boolean>(false);
const logStore = useLogStore();


const channelChartKeys= [
  'audience' as keyof DayStat,
  'liveViewers' as keyof DayStat,
  'dvrViewers' as keyof DayStat,
  'dvrMinutes' as keyof DayStat,
  'liveMinutes' as keyof DayStat,
  'averageViewingTime' as keyof DayStat,
  'totalTime' as keyof DayStat,
  'totalViewers' as keyof DayStat,
]

const channelChartKey = ref<keyof DayStat>(channelChartKeys[0])
const showMinutes = ref<boolean>(false);

const channelTableHeaders = ref([
  { title: t('app.channel.displayNumber'), key: 'display_number' },
  { title: t('app.channel.name'), key: 'name' },
  { title: t('app.channel.liveMinutes'), key: 'liveMinutes' },
  { title: t('app.channel.dvrMinutes'), key: 'dvrMinutes' },
  { title: t('app.channel.liveViewers'), key: 'liveViewers' },
  { title: t('app.channel.dvrViewers'), key: 'dvrViewers' },

])

const audienceChartOptions = {
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  }
};

const channelChartOptions = {
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  }
};

const audienceChartSeries = ref<ChartDateSeries>({name: 'audience', data:[]});

const channelChartSeries = ref<ChartDateSeries[]>([]);
function makeChannelChart(value: keyof DayStat) {
  channelChartSeries.value = [];
  channelStore.getTop().forEach((channel: ChannelEntity)=>{
    const series:ChartDateSeries = { data: [], name: channel.name}
    props.range.forEach((date: Date)=>{
      series.data.push({x: date, y: (channel.getStatDay(date)[value] as number)})
    })
    channelChartSeries.value.push(series);
  });
  audienceChartSeries.value.data = [];
  audienceChartSeries.value.data = channelStore.dayStats.sort(function(a, b){
    if(a.date == b.date){
      return 0;
    }
    return  a.date > b.date ? -1:1
  }).map((value: ChannelsDayStat)=>{
    return {x: value.date, y: value.audience}
  })
  console.dir(audienceChartSeries);
}
function load(){
  channelStore.eraseStat()
  loading.value = true;
  channelChartSeries.value = [];
  logStore.addLog('erase old stat');
  channelStore.setThreshold(props.threshold);
  channelStore.eraseStat();
  channelStore.fillStat(props.range,props.provider).then((channels: ChannelEntity[])=>{
    channelEntities.value = channels;
    makeChannelChart(channelChartKey.value);
    loading.value = false;
  }).catch((error: AxiosError)=>{
    console.dir(error);
    loading.value = false;
  });

}
channelStore.init({enabled: true});
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
      <v-select @update:modelValue="makeChannelChart" v-model="channelChartKey" :items="channelChartKeys">
        <template v-slot:item="{props, item}">
          <v-list-item v-bind="props" :title="$t('app.channel.dayStat.'+ item.raw)">
          </v-list-item>
        </template>
        <template v-slot:selection = "{item}">
          {{ $t('app.channel.dayStat.'+item.raw) }}
        </template>
      </v-select>
    </v-card-title>
    <v-card-text>
      <div style="width: 100%; height: 500px;">
        <apexchart height="500px" type="line" :options="channelChartOptions" :series="channelChartSeries"></apexchart>
      </div>
      <h3>{{$t('app.channels.audience')}}</h3>
      <div style="width: 100%; height: 500px;">
        <apexchart height="500px" type="line" :options="audienceChartOptions" :series="[audienceChartSeries]"></apexchart>
      </div>
    </v-card-text>
  </v-card>x
  <v-card>
    <v-card-title>{{$t('app.channel.report.title')}} {{$t('app.channel.report.to_period')}} {{dayjs(range[0]).format('DD.MM.YYYY')}} - {{dayjs(range[range.length-1]).format('DD.MM.YYYY')}} </v-card-title>
    <v-card-subtitle>{{$t('app.query.threshold')}}: {{threshold}}</v-card-subtitle>
    <v-card-text>
      <v-checkbox v-model="showMinutes" :label="$t('app.query.showMinutes')"></v-checkbox>

      <v-data-table
        :headers="channelTableHeaders"
        :items="channelEntities"
      >

        <template v-slot:[`item.logo_url`]="{value}">
          <v-img :src="value"></v-img>
        </template>

        <template v-if="!showMinutes" v-slot:[`item.liveMinutes`]="{value}">
          {{dayjs.duration(value,'minutes').format('YYYY [year] MM [month] DD [days] HH [hours] mm [minutes]')}}
        </template>
        <template v-if="!showMinutes" v-slot:[`item.dvrMinutes`]="{value}">
          {{dayjs.duration(value,'minutes').format('YYYY [year] MM [month] DD [days] HH [hours] mm [minutes]')}}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  </div>
</template>

<style scoped>

</style>
