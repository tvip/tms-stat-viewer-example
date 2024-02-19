import DeviceEntity from "@/model/DeviceEntity";
import {defineStore} from "pinia";
import {Provider} from "@/dto/provider/Provider";
import dayjs from "dayjs";
import {AxiosResponse} from "axios";
import deviceStatService from "@/service/stat/DeviceStatService";
import {DeviceStatResponse} from "@/dto/stat/DeviceStatResponse";

interface State{
  loaded: boolean;
  devices: DeviceEntity[];
}

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
      this.devices.push(newDeviceEntity)

      return newDeviceEntity
    },

    eraseStat(){
      this.devices = [];

    },

    async getDeviceStat(dateRange: Date[], provider: Provider|null = null):Promise<DeviceEntity[]>{
      this.eraseStat();
      return new Promise<DeviceEntity[]>((resolve) => {
        let count:number = 0;
        if(dateRange.length ==0){
          resolve(this.devices);
        }
        for  (const value of dateRange) {
          deviceStatService.query(
            {
              from: dayjs(value).format('YYYY-MM-DD'),
              to: dayjs(value).format('YYYY-MM-DD'),
              provider_id: provider ? provider.id : null
            }
          ).then((response: AxiosResponse) => {

            const deviceStatResponse: DeviceStatResponse = response.data;
            for (const providerStat of deviceStatResponse.provider_stat){
                for(const deviceStat of providerStat.device_stat){
                  const deviceEntity = this.getDeviceByClass(deviceStat.class);
                  deviceEntity.addStat(value,deviceStat);
                }
            }
            count++;
            if(count == dateRange.length){
              resolve(this.devices);
            }
          })
        }

      });
    },
  }
})
