import {defineStore} from "pinia";
import {toRaw} from "vue";
import {AxiosResponse} from "axios";
import {Channel} from "@/dto/provider/Channel";
import channelService from "@/service/provider/ChannelService";
import ChannelEntity from "@/model/ChannelEntity";
import ChannelStatAggregator, {ChannelsDayStat} from "@/model/ChannelStatAggregator";
import accountStatService from "@/service/stat/AccountStatService";
import dayjs from "dayjs";
import {Provider} from "@/dto/provider/Provider";
import {useLogStore} from "@/store/log";
import {mapWithConcurrency} from "@/service/concurrency";

/**
 * Account stat is megabytes per day and takes seconds on the TMS side,
 * so only a couple of days are requested at once and each response is dropped right after aggregation.
 */
const ACCOUNT_STAT_CONCURRENCY = 2;

interface State{
  loaded: boolean;
  channels: ChannelEntity[];
  dayStats: ChannelsDayStat[];
  threshold: number;

}

export {ChannelsDayStat};

const logStore = useLogStore();
let initPromise: Promise<void>|null = null;

export const useChannelStore = defineStore('channelStore',{
  state: (): State => ({
    channels: [],
    dayStats:[],
    loaded:false,
    threshold: 60
  }),
  actions: {
    getTop(count:number =10): ChannelEntity[]{
      return [...this.channels].sort((a: ChannelEntity, b: ChannelEntity)=>{
        return (b.liveMinutes + b.dvrMinutes) - (a.liveMinutes + a.dvrMinutes);
      }).slice(0,count);
    },
    getChannels():ChannelEntity[]{
      return  this.channels;
    },
    setThreshold(value: number){
      this.threshold = value;
    },

    getChannelById(id: number):ChannelEntity|null{
      const channel =  this.channels.find((value)=>{return value.id == id});
      if(typeof channel != 'undefined'){
        return channel;
      }
      return null;
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

    /**
     * Loads the channel list once; concurrent calls share the same request.
     */
    init({enabled}:{enabled:boolean}):Promise<void>{
      if(initPromise === null){
        initPromise = channelService.collectionAll<Channel>({sort: [], enabled: enabled}).then((channels: Channel[])=>{
          // the server ignores the enabled filter on this endpoint, so it is applied here as well
          const filtered = channels.filter((value: Channel)=>{return value.enabled === enabled});
          this.channels = filtered.map((value: Channel)=>{return ChannelEntity.fromDto(value)});
          this.loaded = true;
          logStore.addLog('loaded ' + filtered.length + ' of ' + channels.length + ' channels');
        }).catch((error)=>{
          initPromise = null;
          throw error;
        });
      }
      return initPromise;
    },

    async fillStat(dateRange: Date[], provider: Provider|null = null):Promise<ChannelEntity[]>{
      if(!this.loaded){
        await this.init({enabled: true});
      }
      const aggregator = new ChannelStatAggregator(toRaw(this.channels), this.threshold);
      await mapWithConcurrency(dateRange, ACCOUNT_STAT_CONCURRENCY, async (value: Date)=>{
        const response: AxiosResponse = await accountStatService.query(
          {
            from: dayjs(value).format('YYYY-MM-DD'),
            to: dayjs(value).format('YYYY-MM-DD'),
            provider_id: provider ? provider.id : null,
          }
        );
        const dayStat = aggregator.addDay(value, response.data);
        logStore.addLog('fetched stat for ' + value.toLocaleDateString() + ', audience ' + dayStat.audience);
      });
      this.channels = aggregator.channels;
      this.dayStats = aggregator.dayStats;
      return this.channels;
    }
  }
})
