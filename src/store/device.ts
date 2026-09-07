import DeviceEntity from "@/model/DeviceEntity";
import {defineStore} from "pinia";
import {Provider} from "@/dto/provider/Provider";
import dayjs from "dayjs";
import {AxiosResponse} from "axios";
import deviceStatService from "@/service/stat/DeviceStatService";
import {DeviceStatResponse} from "@/dto/stat/DeviceStatResponse";
import {useLogStore} from "@/store/log";
import {mapWithConcurrency} from "@/service/concurrency";

const DEVICE_STAT_CONCURRENCY = 3;

interface State{
  loaded: boolean;
  devices: DeviceEntity[];
}

const logStore = useLogStore();

export const useDeviceStore = defineStore('deviceStore', {
  state: (): State => ({
    devices: [],
    loaded: false,
  }),
  actions: {
    eraseStat(){
      this.devices = [];
      this.loaded = false;
    },

    /**
     * Loads device stat day by day (same as backend tms-stat-view does) and aggregates it by device class.
     * Aggregation runs on plain objects, the result is put into the state once.
     */
    async getDeviceStat(dateRange: Date[], provider: Provider|null = null):Promise<DeviceEntity[]>{
      this.eraseStat();
      const byName: Map<string, DeviceEntity> = new Map();
      const getDevice = (name: string): DeviceEntity => {
        let device = byName.get(name);
        if(!device){
          device = new DeviceEntity();
          device.name = name;
          byName.set(name, device);
        }
        return device;
      };

      await mapWithConcurrency(dateRange, DEVICE_STAT_CONCURRENCY, async (value: Date)=>{
        const response: AxiosResponse = await deviceStatService.query(
          {
            from: dayjs(value).format('YYYY-MM-DD'),
            to: dayjs(value).format('YYYY-MM-DD'),
            provider_id: provider ? provider.id : null
          }
        );
        const deviceStatResponse: DeviceStatResponse = response.data;
        for (const providerStat of deviceStatResponse.provider_stat){
          for(const deviceStat of providerStat.device_stat){
            getDevice(DeviceEntity.nameFromClass(deviceStat.class)).addStat(value, deviceStat);
          }
        }
        logStore.addLog('fetched device stat for ' + value.toLocaleDateString());
      });

      this.devices = Array.from(byName.values()).sort((a: DeviceEntity, b: DeviceEntity)=>{return a.name.localeCompare(b.name)});
      this.loaded = true;
      return this.devices;
    },
  }
})
