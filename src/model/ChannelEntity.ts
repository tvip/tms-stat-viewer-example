import {Channel} from "@/dto/provider/Channel";
import dayjs from "dayjs";

/**
 * Key of a calendar day, used to match stats to days (comparing Date objects by day of month
 * merged e.g. Jan 15 and Feb 15).
 */
export function dayKey(date: Date): string{
  return dayjs(date).format('YYYY-MM-DD');
}

/**
 * TMS image links carry size placeholders: /image/png/<id>/${w}/${h}/${mode}/logo.png
 * (the API returns them URL-encoded). Without substitution the server sends the full-size image.
 */
export function channelLogoUrl(url: string|null|undefined, width: number, height: number, mode: string = 'fit'): string|undefined{
  if(!url){
    return undefined;
  }
  return url
    .replace(/\$\{w\}|%24%7Bw%7D/g, String(width))
    .replace(/\$\{h\}|%24%7Bh%7D/g, String(height))
    .replace(/\$\{mode\}|%24%7Bmode%7D/g, mode);
}

export  class DayStat {
  date: Date = new Date();
  key: string = '';
  liveViewers: number = 0;
  dvrViewers: number = 0;
  dvrMinutes: number = 0;
  liveMinutes: number = 0;
  averageViewingTime: number = 0;
  totalTime: number = 0;
  totalViewers: number = 0;
  audience: number = 0;


  addDvrMinutes(minutes: number){
    this.dvrMinutes +=minutes;
    this.dvrViewers++;

    this.totalViewers++;
    this.totalTime += minutes;

    this.averageViewingTime = Math.floor(this.totalTime/this.totalViewers);


  }
  addLiveMinutes(minutes: number){
    this.liveMinutes += minutes;
    this.liveViewers++;

    this.totalViewers++;
    this.totalTime += minutes;

    this.averageViewingTime = Math.floor(this.totalTime/this.totalViewers);

  }

  addAudience(count:number){
    this.audience += count;
  }

}

export default class ChannelEntity {
  id:number = 0;
  name:string = '';
  text_name: string = '';
  display_number: string = '';
  logo_url: string|null = null;
  enabled: boolean = false;
  time_shift_depth: number = 0;
  stats: DayStat[]=[];
  liveViewers: number = 0;
  dvrViewers: number = 0;
  dvrMinutes: number = 0;
  liveMinutes: number = 0;

  addLiveMinutes(date:Date, minutes: number){
      this.getStatDay(date).addLiveMinutes(minutes)
      this.liveMinutes += minutes;
      this.liveViewers ++;
  }

  addDvrMinutes(date:Date, minutes: number){
      this.getStatDay(date).addDvrMinutes(minutes)
      this.dvrMinutes += minutes;
      this.dvrViewers++;
  }

  addAudience(date: Date, count: number){
    this.getStatDay(date).addAudience(count)
  }

  getStatDay(date: Date): DayStat{
    return this.getStatDayByKey(dayKey(date), date);
  }

  getStatDayByKey(key: string, date: Date): DayStat{
    let stat = this.stats.find((value: DayStat)=>{return value.key == key})
    if(stat){
      return stat;
    }
    stat = new DayStat();
    stat.date = date;
    stat.key = key;
    this.stats.push(stat);
    return stat;
  }

  /**
   * Copy of the channel without any stat.
   */
  cloneMeta(): ChannelEntity{
    const e:ChannelEntity = new ChannelEntity();
    e.id = this.id;
    e.name = this.name;
    e.text_name = this.text_name;
    e.display_number = this.display_number;
    e.logo_url = this.logo_url;
    e.enabled = this.enabled;
    e.time_shift_depth = this.time_shift_depth;
    return e;
  }

  static  fromDto(o:Channel):ChannelEntity{
    const e:ChannelEntity = new ChannelEntity();
    e.id = o.id;
    e.name = o.name;
    e.text_name = o.text_name;
    e.display_number = o.display_number;
    e.logo_url = o.logo_url;
    e.enabled = o.enabled;
    e.time_shift_depth = o.time_shift_depth
    return e;
  }
}
