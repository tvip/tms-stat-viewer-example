import {defineStore} from "pinia";

export enum LogLevel {
  info,
  warning,
  debug
}

interface LogRecord {
  date: Date,
  message: string
  level: LogLevel
}

interface State{
  logs: LogRecord[]
}

/** every request adds two records, the log is capped so long sessions do not grow it forever */
const MAX_LOG_RECORDS = 1000;

export const useLogStore = defineStore('logStore', {
  state: (): State => ({
    logs: []
  }),
  actions: {
    erase():void{
      this.logs = [];
    },
    addLog(message: string, level: LogLevel = LogLevel.info){
      this.logs.unshift(
        {date: new Date(), message: message, level: level}
      )
      if(this.logs.length > MAX_LOG_RECORDS){
        this.logs.length = MAX_LOG_RECORDS;
      }
    }
  }
})
