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

    }
  }
})
