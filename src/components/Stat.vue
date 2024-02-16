<script setup lang="ts">


import dayjs from "dayjs";
import {useProviderStore} from "@/store/provider";
import {ref} from "vue";
import {useChannelStore} from "@/store/channel";
import {Provider} from "@/dto/provider/Provider";
import {useLogStore} from "@/store/log";
import {ChartDateSeries} from "@/interface/ChartDateSeries";
import ChannelEntity, {DayStat} from "@/model/ChannelEntity";
import {useLocale} from "vuetify";
const range = ref<Date[]>([new Date(), new Date()])
const provider = ref<Provider|null>(null)
const loading = ref<boolean>(false);
const threshold = ref<number>(5);
const { t } = useLocale()

const headers = ref([
  { title: t('app.channel.name'), key: 'name' },
  { title: t('app.channel.liveMinutes'), key: 'liveMinutes' },
  { title: t('app.channel.dvrMinutes'), key: 'dvrMinutes' },
  { title: t('app.channel.liveViewers'), key: 'liveViewers' },
  { title: t('app.channel.dvrViewers'), key: 'dvrViewers' },

])

const options = {
  chart:{
    stacked: true
  },
  plotOptions: {
    bar: {
      horizontal: false
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: function (val:number) {
        return dayjs(new Date(val)).format('YYYY-MM-DD');
      }

    }
  }
};

const series= ref<ChartDateSeries[]>([]);


const providerStore = useProviderStore();
const channelStore = useChannelStore();
const logStore = useLogStore();
const channelEntities = ref<ChannelEntity[]>( []);
function load(){
  loading.value = true;
  logStore.addLog('erase old stat');
  series.value = [];
  channelStore.setThreshold(threshold.value);
  channelStore.eraseStat();



  channelStore.fillStat(range.value, provider.value).then((channels: ChannelEntity[])=>{

    channelEntities.value = channels;
    loading.value = false;
    convert();

  })
}

function eraseStat(){
  channelStore.eraseStat();
}

function convert(){

  series.value = [];
  const other:ChartDateSeries = {name: 'other', data: []};
  series.value.push(other);
  for(const channelEntity of channelEntities.value.values()){
    const s:ChartDateSeries = {name: channelEntity.name, data:[]};
    channelEntity.stats.forEach((dayStat: DayStat)=>{
      s.data.push({x: dayStat.date, y: dayStat.liveViewers});
    })
    series.value.push(s);
  }


}

</script>

<template>
  <v-sheet>
        <v-row>
          <v-col>
            <v-autocomplete v-model="provider" :label="$t('app.query.provider')" item-title="provider_name"  :items="providerStore.getProviders()" :return-object="true" :clearable="true"/>
          </v-col>
          <v-col>
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  :label="$t('app.query.range')"
                  v-model="range"
                  v-bind="props"
                  :value="dayjs(range[0]).format('DD.MM.YYYY')+' - '+dayjs(range[range.length-1]).format('DD.MM.YYYY')"
                >
                </v-text-field>
              </template>
              <v-date-picker v-model="range" multiple="range" :label="$t('app.query.from')"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-slider min="0" max="90" step="5" :label="threshold.toString()" v-model="threshold" @update:modelValue="eraseStat"></v-slider>
          </v-col>
          <v-col>
            <v-btn @click="load" icon="mdi-refresh"></v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-progress-linear
            indeterminate
            color="yellow-darken-2"
            v-if="loading"
          ></v-progress-linear>
        </v-row>

    <v-row>
      <v-card>
        <v-card-title>{{$t('app.channel.report.title')}} {{$t('app.channel.report.to_period')}} {{dayjs(range[0]).format('DD.MM.YYYY')}} - {{dayjs(range[range.length-1]).format('DD.MM.YYYY')}} </v-card-title>
        <v-card-subtitle>{{$t('app.query.threshold')}}: {{threshold}}</v-card-subtitle>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="channelEntities"
          >
            <template v-slot:[`item.liveMinutes`]="{value}">
              {{ new Date(value * 1000)
              .toISOString()
               }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>


    </v-row>
  </v-sheet>

</template>

<style scoped>

</style>
