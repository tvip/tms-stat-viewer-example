import {DeviceStat} from "@/dto/stat/DeviceStatResponse";
import dayjs from "dayjs";

export class DeviceDayStat{
  date: Date = new Date();
  dvr_hours: number = 0;
  live_hours: number = 0;
  unique_devices: number = 0;
}
export default class DeviceEntity {
  static readonly CLASS_PREFIX = 'deviceclass.';

  class: string = '';
  name: string = '';

  stats: DeviceDayStat[]=[];

  dvr_hours: number = 0;
  live_hours: number = 0;
  unique_devices: number = 0;

  static nameFromClass(cls: string): string{
    return cls.startsWith(DeviceEntity.CLASS_PREFIX) ? cls.substring(DeviceEntity.CLASS_PREFIX.length) : cls;
  }

  erase(){
    this.dvr_hours = 0;
    this.live_hours = 0;
    this.unique_devices = 0;
    this.stats = [];
  }

  /**
   * Accumulates stat of one provider for one day.
   * Hours are summed over providers and days, unique devices are summed over providers
   * per day and the period value is the maximum of daily values.
   */
  addStat(date: Date, o:DeviceStat):void{
    const e = this.getStatDay(date);
    e.dvr_hours += o.dvr_hours;
    e.live_hours += o.live_hours;
    e.unique_devices += o.unique_devices;

    this.dvr_hours += o.dvr_hours;
    this.live_hours += o.live_hours;
    if(e.unique_devices > this.unique_devices){
      this.unique_devices = e.unique_devices;
    }
  }

  getStatDay(date: Date){
    let stat = this.stats.find((value: DeviceDayStat)=>{return dayjs(value.date).isSame(date,'day')})
    if(stat instanceof DeviceDayStat){
      return stat;
    }
    stat = new DeviceDayStat();
    stat.date = date;
    this.stats.push(stat);
    return stat;
  }

}
