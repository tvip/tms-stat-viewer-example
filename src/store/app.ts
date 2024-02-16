// Utilities
import { defineStore } from 'pinia'
import router from "@/router";

interface State{
  theme:string,
  token:string|null,
  target: string,
  locale:string,
}

export const useAppStore = defineStore('app', {
  state: (): State => ({
    theme: 'light',
    token: null,
    target: '',
    locale: 'en',
  }),
  actions:{
    logout(){
      this.target = '';
      this.token = null;
      router.replace({name:'login'})
    },
    setToken(token:string|null){
      this.token = token;
    },
    setLocale(locale:string){
      this.locale = locale
    },
    setTarget(target:string){
      this.target = target;
    },
    setTheme(theme:string){
      this.theme = theme
    },


  },
  persist: {debug:true}
})
