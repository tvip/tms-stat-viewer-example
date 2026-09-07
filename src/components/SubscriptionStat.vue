<script setup lang="ts">
import {computed, ref} from "vue";
import dayjs from "dayjs";
import {useLocale} from "vuetify";
import {AxiosError} from "axios";
import {download, generateCsv, mkConfig} from "export-to-csv";
import {useSubscriptionStore} from "@/store/subscription";
import {useProviderStore} from "@/store/provider";
import {useLogStore} from "@/store/log";
import {Provider} from "@/dto/provider/Provider";
import {SubscriptionMetric, subscriptionMetrics, SubscriptionRow, Tariff} from "@/model/SubscriptionEntity";
import {ChartDateSeries} from "@/interface/ChartDateSeries";

const { t } = useLocale()
const subscriptionStore = useSubscriptionStore();
const providerStore = useProviderStore();
const logStore = useLogStore();

const props = defineProps(['range','provider'])
const loading = ref<boolean>(false);

const metricItems: SubscriptionMetric[] = [...subscriptionMetrics];
const metric = ref<SubscriptionMetric>('enabled_account_with_devices');
const selectedTariffs = ref<number[]|null>([]);
const filterDescription = ref<string|null>('');

const chartOptions = {
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  }
};

type TableHeader = {title: string, key: string};
type TableRow = Record<string, string|number>;

function getProvider(id: number): Provider|undefined{
  return providerStore.getProviders().find((value: Provider)=>{return value.id == id});
}

function periodSuffix(): string{
  return dayjs(props.range[0]).format('YYYY-MM-DD') + '_' + dayjs(props.range[props.range.length-1]).format('YYYY-MM-DD');
}

/**
 * Tariffs shown in the report: all of them when nothing is selected (same as tms-stat-view).
 */
const tariffs = computed<Tariff[]>(()=>{
  const selected = selectedTariffs.value ?? [];
  if(selected.length == 0){
    return subscriptionStore.tariffs;
  }
  return subscriptionStore.tariffs.filter((tariff: Tariff)=>{return selected.includes(tariff.id)});
});

/**
 * Rows filtered by provider comment substring.
 */
const rows = computed<SubscriptionRow[]>(()=>{
  const filter = (filterDescription.value ?? '').trim();
  if(filter == ''){
    return subscriptionStore.rows;
  }
  return subscriptionStore.rows.filter((row: SubscriptionRow)=>{
    const provider = getProvider(row.provider_id);
    return provider?.provider_comment ? provider.provider_comment.includes(filter) : false;
  });
});

const tableHeaders = computed<TableHeader[]>(()=>{
  const headers: TableHeader[] = [
    { title: t('app.subscription.provider'), key: 'provider_name' },
    { title: t('app.subscription.description'), key: 'provider_comment' },
    { title: t('app.subscription.date'), key: 'date' },
  ];
  tariffs.value.forEach((tariff: Tariff)=>{
    headers.push({ title: tariff.name, key: 'tariff_' + tariff.id });
  });
  return headers;
});

const tableItems = computed<TableRow[]>(()=>{
  return rows.value.map((row: SubscriptionRow)=>{
    const provider = getProvider(row.provider_id);
    const item: TableRow = {
      provider_name: provider ? provider.provider_name : row.provider_id.toString(),
      provider_comment: provider?.provider_comment ?? '',
      date: dayjs(row.date).format('YYYY-MM-DD'),
    };
    tariffs.value.forEach((tariff: Tariff)=>{
      item['tariff_' + tariff.id] = row.getValue(tariff.id, metric.value);
    });
    return item;
  });
});

/**
 * One line per tariff, value summed over providers per day.
 */
const chartSeries = computed<ChartDateSeries[]>(()=>{
  return tariffs.value.map((tariff: Tariff)=>{
    const byDate = new Map<number, number>();
    rows.value.forEach((row: SubscriptionRow)=>{
      const key = dayjs(row.date).startOf('day').valueOf();
      byDate.set(key, (byDate.get(key) ?? 0) + row.getValue(tariff.id, metric.value));
    });
    const data = Array.from(byDate.entries())
      .sort((a, b)=>{return a[0] - b[0]})
      .map(([x, y])=>{return {x: new Date(x), y: y}});
    return {name: tariff.name, data: data};
  });
});

function load(){
  loading.value = true;
  logStore.addLog('erase old subscription stat');
  subscriptionStore.fillStat(props.range, props.provider).then(()=>{
    const known = subscriptionStore.tariffs.map((tariff: Tariff)=>{return tariff.id});
    selectedTariffs.value = (selectedTariffs.value ?? []).filter((id: number)=>{return known.includes(id)});
    loading.value = false;
  }).catch((error: AxiosError)=>{
    console.dir(error);
    loading.value = false;
  });
}

function downloadCsv(){
  const config = mkConfig({
    filename: 'subscription-report_' + metric.value + '_' + periodSuffix(),
    columnHeaders: tableHeaders.value.map((header: TableHeader)=>{return {key: header.key, displayLabel: header.title}})
  })
  const csv = generateCsv(config)(tableItems.value);
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
    <v-card-title>{{$t('app.subscription.title')}} {{$t('app.subscription.to_period')}} {{dayjs(range[0]).format('DD.MM.YYYY')}} - {{dayjs(range[range.length-1]).format('DD.MM.YYYY')}} </v-card-title>
    <v-card-text>
      <v-select v-model="metric" :items="metricItems" :label="$t('app.subscription.type')">
        <template v-slot:item="{props, item}">
          <v-list-item v-bind="props" :title="$t('app.subscription.types.'+ item.raw)">
          </v-list-item>
        </template>
        <template v-slot:selection = "{item}">
          {{ $t('app.subscription.types.'+item.raw) }}
        </template>
      </v-select>
      <v-select
        v-model="selectedTariffs"
        :items="subscriptionStore.tariffs"
        item-title="name"
        item-value="id"
        multiple
        chips
        clearable
        :label="$t('app.subscription.tariffs')"
        :hint="$t('app.subscription.tariffs_hint')"
        persistent-hint
      ></v-select>
      <v-text-field v-model="filterDescription" clearable :label="$t('app.subscription.filterDescription')"></v-text-field>
      <h3>{{$t('app.subscription.chart')}}</h3>
      <div style="width: 100%; height: 500px;">
        <apexchart height="500px" type="line" :options="chartOptions" :series="chartSeries"></apexchart>
      </div>
    </v-card-text>
  </v-card>
  <v-card>
    <v-card-text>
      <v-btn prepend-icon="mdi-file-delimited" @click="downloadCsv">{{$t('app.common.export_csv')}}</v-btn>
      <v-data-table
        :headers="tableHeaders"
        :items="tableItems"
      ></v-data-table>
    </v-card-text>
  </v-card>
  </div>
</template>

<style scoped>

</style>
