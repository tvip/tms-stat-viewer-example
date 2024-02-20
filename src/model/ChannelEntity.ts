import {Channel} from "@/dto/provider/Channel";

export  class DayStat {
  date: Date = new Date();
  liveViewers: number = 0;
  dvrViewers: number = 0;
  dvrMinutes: number = 0;
  liveMinutes: number = 0;
  averageViewingTime: number = 0;
  totalTime: number = 0;
  totalViewers: number = 0;
  auditory: number = 0;


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

  addAuditory(count:number){
    this.auditory += count;
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

  addAuditory(date: Date,count: number){
    this.getStatDay(date).addAuditory(count)
  }

  getStatDay(date: Date){
    let stat = this.stats.find((value: DayStat)=>{return value.date.getDate() == date.getDate()})
    if(stat instanceof DayStat){
      return stat;
    }
    stat = new DayStat();
    stat.date = date;
    this.stats.push(stat);
    return stat;
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
