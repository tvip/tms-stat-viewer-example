import ChannelEntity, {DayStat, dayKey} from "@/model/ChannelEntity";
import {AccountStatResponse} from "@/dto/stat/AccountStatResponse";

export class ChannelsDayStat{
  date: Date = new Date();
  /** count of unique accounts which watched at least one channel above the threshold */
  audience: number = 0;
}

/**
 * Aggregates /api/stats/account responses into per-channel totals and per-day stats.
 *
 * Works on plain objects only: it is called for every channel of every account (tens of
 * thousands of records per day on a real TMS) and the same loop over reactive store state
 * with Array.find lookups is orders of magnitude slower. The store copies the result into
 * its state once, when all days are processed.
 */
export default class ChannelStatAggregator {
  readonly channels: ChannelEntity[];
  readonly dayStats: ChannelsDayStat[] = [];
  private readonly byId: Map<number, ChannelEntity> = new Map();
  private readonly threshold: number;

  constructor(channels: ChannelEntity[], threshold: number) {
    this.threshold = threshold;
    this.channels = channels.map((channel: ChannelEntity)=>{return channel.cloneMeta()});
    this.channels.forEach((channel: ChannelEntity)=>{this.byId.set(channel.id, channel)});
  }

  addDay(date: Date, response: AccountStatResponse): ChannelsDayStat{
    const key = dayKey(date);
    const dayStatByChannel: Map<number, DayStat> = new Map();
    const dayStat = new ChannelsDayStat();
    dayStat.date = date;

    for (const providerStat of response.provider_stat) {
      for (const account of providerStat.account_stat) {
        let viewed = false;
        for (const view of account.channels) {
          const channel = this.byId.get(view.channel_id);
          if (!channel) {
            continue;
          }
          const liveMinutes = view.live_minutes ? view.live_minutes : view.live_hours * 60;
          const dvrMinutes = view.dvr_minutes ? view.dvr_minutes : view.dvr_hours * 60;
          const live = liveMinutes >= this.threshold;
          const dvr = dvrMinutes >= this.threshold;
          if (!live && !dvr) {
            continue;
          }
          let day = dayStatByChannel.get(channel.id);
          if (!day) {
            day = channel.getStatDayByKey(key, date);
            dayStatByChannel.set(channel.id, day);
          }
          if (live) {
            day.addLiveMinutes(liveMinutes);
            channel.liveMinutes += liveMinutes;
            channel.liveViewers++;
          }
          if (dvr) {
            day.addDvrMinutes(dvrMinutes);
            channel.dvrMinutes += dvrMinutes;
            channel.dvrViewers++;
          }
          day.addAudience(1);
          viewed = true;
        }
        if (viewed) {
          dayStat.audience++;
        }
      }
    }

    this.dayStats.push(dayStat);
    this.dayStats.sort((a: ChannelsDayStat, b: ChannelsDayStat)=>{return a.date.valueOf() - b.date.valueOf()});
    return dayStat;
  }
}
