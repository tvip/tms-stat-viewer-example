import {defineStore} from "pinia";
import {AxiosError, AxiosResponse} from "axios";
import {Channel} from "@/dto/provider/Channel";
import channelService from "@/service/provider/ChannelService";
import ChannelEntity from "@/model/ChannelEntity";
import accountStatService from "@/service/stat/AccountStatService";
import dayjs from "dayjs";
import {AccountStatResponse} from "@/dto/stat/AccountStatResponse";
import {Provider} from "@/dto/provider/Provider";
import {useLogStore} from "@/store/log";

interface State{
  loaded: boolean;
  channels: ChannelEntity[];
  dayStats: ChannelsDayStat[];
  threshold: number;

}

export class ChannelsDayStat{
  date: Date = new Date();
  audience: number = 0;
}

const logStore = useLogStore();
export const useChannelStore = defineStore('channelStore',{
  state: (): State => ({
    channels: [],
    dayStats:[],
    loaded:false,
    threshold: 60
  }),
  actions: {
    getTop(count:number =10){
      return this.channels.sort(function (a, b){
        if(a.liveMinutes+a.dvrMinutes == b.liveMinutes+a.dvrMinutes){
          return 0;
        }

        return a.liveMinutes+a.dvrMinutes > b.liveMinutes+a.dvrMinutes ? -1:1
      }).slice(0,count);
    },
    getChannels():ChannelEntity[]{
      return  this.channels;
    },
    setThreshold(value: number){
      this.threshold = value;
    },

    getChannelById(id: number):ChannelEntity|null{
      const channel =  this.getChannels().find((value)=>{return value.id == id});
      if(typeof channel != 'undefined'){
        return channel;
      }
      return null;
    },

    getChannelsDayStat(date: Date):ChannelsDayStat{
      const s = this.dayStats.find((value: ChannelsDayStat)=>{return value.date == date})
      if(typeof  s != 'undefined'){
        return s;
      }
      const channelsDayStat = new ChannelsDayStat();
      channelsDayStat.date = date;
      this.dayStats.push(channelsDayStat);
      return channelsDayStat;
    },


    eraseStat():void{
      this.channels.forEach((channelEntity)=>{
        channelEntity.stats = [];
        channelEntity.liveViewers = 0;
        channelEntity.dvrViewers = 0;
        channelEntity.dvrMinutes = 0;
        channelEntity.liveMinutes = 0;
      })
      this.dayStats = [];
    },

    init({enabled}:{enabled:boolean}):void{
      channelService.collection({start:0, limit: 999, sort:[], enabled: enabled}).then((response: AxiosResponse)=>{
        this.channels = response.data.data.map((value: Channel)=>{return ChannelEntity.fromDto(value)});
        this.loaded = true;
      })
    },
    async fillStat(dateRange: Date[], provider: Provider|null = null):Promise<ChannelEntity[]>{
      return new Promise<ChannelEntity[]>((resolve, reject) => {
        let count:number = 0;
        if(dateRange.length ==0){
          resolve(this.channels);
        }
        for  (const value of dateRange) {
          this.fillDay(value,provider).then(()=>{
            count++;
            if(count == dateRange.length){
              resolve(this.channels);
            }
          }).catch((error: AxiosError)=>{
            reject(error);
          })
        }
      });
     },
    async fillDay(value:Date, provider: Provider|null = null):Promise<number>{
      this.getChannelsDayStat(value).audience = 0;

      return new Promise((resolve,reject)=>{
        accountStatService.query(
          {
            from: dayjs(value).format('YYYY-MM-DD'),
            to: dayjs(value).format('YYYY-MM-DD'),
            provider_id: provider ? provider.id : null,
          }
        ).then((response: AxiosResponse) => {
          logStore.addLog('fetched stat for ' + value.toLocaleDateString());
          let count: number = 0;
          const accountData: AccountStatResponse = response.data;
          if(accountData.provider_stat.length == 0){
            resolve(0);
          }
          for (const stat of accountData.provider_stat) {

            for (const account of stat.account_stat) {
              let channelViewCount=0;

              for (const channel of account.channels) {
                const channelEntity = this.getChannelById(channel.channel_id);
                if (channelEntity) {
                  const liveMinutes = channel.live_minutes ? channel.live_minutes: channel.live_hours*60;
                  const dvrMinutes:number = channel.dvr_minutes ? channel.dvr_minutes: channel.dvr_hours*60;
                  if(liveMinutes >= this.threshold){
                    channelEntity.addLiveMinutes(value,liveMinutes)
                  }
                  if(dvrMinutes >= this.threshold){
                    channelEntity.addDvrMinutes(value,dvrMinutes)
                  }

                  if(liveMinutes >= this.threshold || dvrMinutes >= this.threshold){
                    channelEntity.addAudience(value,1);
                    channelViewCount++;
                  }
                }
              }
              if(channelViewCount>0){
                this.getChannelsDayStat(value).audience++;
              }
              count++;
              if(count == accountData.provider_stat.length){
                resolve(count);
              }
            }


          }

        }).catch((error: AxiosError)=>{
          reject(error);
        })
      })

    }
  }
})
