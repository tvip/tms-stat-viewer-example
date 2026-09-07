import {defineStore} from "pinia";
import dayjs from "dayjs";
import {AxiosResponse} from "axios";
import subscriptionStatService from "@/service/stat/SubscriptionStatService";
import {SubscriptionStatResponse} from "@/dto/stat/SubscriptionStatResponse";
import {Provider} from "@/dto/provider/Provider";
import {SubscriptionRow, Tariff} from "@/model/SubscriptionEntity";
import {useLogStore} from "@/store/log";

interface State{
  loaded: boolean;
  tariffs: Tariff[];
  rows: SubscriptionRow[];
}

const logStore = useLogStore();

export const useSubscriptionStore = defineStore('subscriptionStore', {
  state: (): State => ({
    loaded: false,
    tariffs: [],
    rows: [],
  }),
  actions: {
    eraseStat(){
      this.rows = [];
      this.tariffs = [];
      this.loaded = false;
    },

    getTariff(id: number, name: string): Tariff{
      const tariff = this.tariffs.find((value: Tariff)=>{return value.id == id});
      if(typeof tariff != 'undefined'){
        return tariff;
      }
      const newTariff = new Tariff();
      newTariff.id = id;
      newTariff.name = name;
      this.tariffs.push(newTariff);
      return newTariff;
    },

    /**
     * Subscription stat is requested once for the whole period (same as tms-stat-view does).
     */
    async fillStat(dateRange: Date[], provider: Provider|null = null): Promise<SubscriptionRow[]>{
      this.eraseStat();
      if(dateRange.length == 0){
        return this.rows;
      }
      const dates = dateRange.map((value: Date)=>{return dayjs(value)}).sort((a, b)=>{return a.valueOf() - b.valueOf()});
      const response: AxiosResponse = await subscriptionStatService.query(
        {
          from: dates[0].format('YYYY-MM-DD'),
          to: dates[dates.length-1].format('YYYY-MM-DD'),
          provider_id: provider ? provider.id : null
        }
      );
      const data: SubscriptionStatResponse = response.data;
      for(const providerStat of data.provider_stat){
        for(const dayStat of providerStat.subscriptions_stat){
          const row = new SubscriptionRow();
          row.provider_id = providerStat.provider_id;
          row.date = dayjs(dayStat.date).toDate();
          for(const subscription of dayStat.subscriptions){
            this.getTariff(subscription.tariff_id, subscription.name);
            row.subscriptions[subscription.tariff_id] = subscription;
          }
          this.rows.push(row);
        }
      }
      this.tariffs.sort((a: Tariff, b: Tariff)=>{return a.name.localeCompare(b.name)});
      this.rows.sort((a: SubscriptionRow, b: SubscriptionRow)=>{
        if(a.provider_id != b.provider_id){
          return a.provider_id - b.provider_id;
        }
        return a.date.valueOf() - b.date.valueOf();
      });
      logStore.addLog('fetched subscription stat: ' + this.rows.length + ' rows, ' + this.tariffs.length + ' tariffs');
      this.loaded = true;
      return this.rows;
    },
  }
})
