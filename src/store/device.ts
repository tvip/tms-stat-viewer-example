import DeviceEntity from "@/model/DeviceEntity";
import {defineStore} from "pinia";
import {Provider} from "@/dto/provider/Provider";
import dayjs from "dayjs";
import {AxiosResponse} from "axios";
import deviceStatService from "@/service/stat/DeviceStatService";
import {DeviceStatResponse} from "@/dto/stat/DeviceStatResponse";
import {useLogStore} from "@/store/log";

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
    getDeviceByClass(cls: string):DeviceEntity{
      const deviceEntity =  this.devices.find((value)=>{return value.class == cls});
      if(typeof deviceEntity != 'undefined'){
        return deviceEntity;
      }
      const newDeviceEntity = new DeviceEntity();
      newDeviceEntity.class = cls;
      newDeviceEntity.name = DeviceEntity.nameFromClass(cls);
      this.devices.push(newDeviceEntity)

      return newDeviceEntity
    },

    eraseStat(){
      this.devices = [];
      this.loaded = false;
    },

    /**
     * Loads device stat day by day (same as backend tms-stat-view does) and aggregates it by device class.
     */
    async getDeviceStat(dateRange: Date[], provider: Provider|null = null):Promise<DeviceEntity[]>{
      this.eraseStat();
      await Promise.all(dateRange.map((value: Date)=>{
        return deviceStatService.query(
          {
            from: dayjs(value).format('YYYY-MM-DD'),
            to: dayjs(value).format('YYYY-MM-DD'),
            provider_id: provider ? provider.id : null
          }
        ).then((response: AxiosResponse) => {
          const deviceStatResponse: DeviceStatResponse = response.data;
          for (const providerStat of deviceStatResponse.provider_stat){
            for(const deviceStat of providerStat.device_stat){
              this.getDeviceByClass(deviceStat.class).addStat(value, deviceStat);
            }
          }
          logStore.addLog('fetched device stat for ' + value.toLocaleDateString());
        });
      }));
      this.devices.sort((a: DeviceEntity, b: DeviceEntity)=>{return a.name.localeCompare(b.name)});
      this.loaded = true;
      return this.devices;
    },
  }
})
