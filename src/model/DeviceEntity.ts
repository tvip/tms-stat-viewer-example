import {DeviceStat} from "@/dto/stat/DeviceStatResponse";

export class DeviceDayStat{
  date: Date = new Date();
  dvr_hours: number = 0;
  live_hours: number = 0;
  unique_devices: number = 0;
}
export default class DeviceEntity {
  class: string = '';

  stats: DeviceDayStat[]=[];

  dvr_hours: number = 0;
  live_hours: number = 0;
  unique_devices: number = 0;

  erase(){
    this.dvr_hours = 0;
    this.live_hours = 0;
    this.unique_devices = 0;
    this.stats = [];
  }

  addStat(date: Date, o:DeviceStat):void{
    const e = this.getStatDay(date);
    e.date = date;
    e.dvr_hours = o.dvr_hours;
    e.live_hours = o.live_hours;
    e.unique_devices = o.unique_devices;

    this.dvr_hours += o.dvr_hours;
    this.live_hours += o.live_hours;
    if(o.unique_devices > this.unique_devices){
      this.unique_devices = o.unique_devices;
    }
  }

  getStatDay(date: Date){
    let stat = this.stats.find((value: DeviceDayStat)=>{return value.date.getDate() == date.getDate()})
    if(stat instanceof DeviceDayStat){
      return stat;
    }
    stat = new DeviceDayStat();
    stat.date = date;
    this.stats.push(stat);
    return stat;
  }

}
