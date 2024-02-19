<script setup lang="ts">

import duration from "dayjs/plugin/duration"
import dayjs from "dayjs";
import {useProviderStore} from "@/store/provider";
import {ref} from "vue";
import {Provider} from "@/dto/provider/Provider";
import {useLocale} from "vuetify";

import ChannelsStat from "@/components/ChannelsStat.vue";
import DeviceStat from "@/components/DeviceStat.vue";
const providerStore = useProviderStore();

const { t } = useLocale()

const range = ref<Date[]>([dayjs().subtract(2,'day').toDate(), dayjs().subtract(1,'day').toDate()])
const provider = ref<Provider|null>(null)
const threshold = ref<number>(5);


dayjs.extend(duration);
const tab = ref();
const channelStat = ref();
const deviceStat = ref();



function update(){
  channelStat.value.load();
  deviceStat.value.load();
}


</script>

<template>

  <v-card>
    <v-card-text>
  <v-autocomplete v-model="provider" :label="$t('app.query.provider')" item-title="provider_name"  :items="providerStore.getProviders()" :return-object="true" :clearable="true"/>

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
  <v-slider min="0" max="90" step="5" :label="t('app.query.threshold')+': '+threshold.toString()" v-model="threshold"></v-slider>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
        <v-btn @click="update" prepend-icon="mdi-refresh" color="primary">{{$t('app.query.do')}}</v-btn>
    </v-card-actions>
  </v-card>
  <v-card>
    <v-tabs
      v-model="tab"
      bg-color="primary"
    >
      <v-tab value="channel">{{$t('app.stat.tab.channel')}}</v-tab>
      <v-tab value="device">{{$t('app.stat.tab.device')}}</v-tab>

    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="channel">
         <ChannelsStat ref="channelStat" :provider="provider" :range="range" :threshold="threshold"></ChannelsStat>
        </v-window-item>

        <v-window-item value="device">
          <DeviceStat ref="deviceStat" :provider="provider" :range="range"></DeviceStat>
        </v-window-item>

      </v-window>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
