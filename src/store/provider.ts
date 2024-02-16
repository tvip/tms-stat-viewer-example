import {defineStore} from "pinia";
import {Provider} from "@/dto/provider/Provider";
import providerService from "@/service/provider/ProviderService";
import {AxiosResponse} from "axios";
interface State{
  loaded: boolean;
  providers: Provider[]
}

export const useProviderStore = defineStore('providerStore',{
  state: (): State => ({
    providers: [],
    loaded:false
  }),
  actions: {
    setProviders(providers: Provider[]):void{
      this.providers = providers;
    },
    getProviders():Provider[]{
      if(this.loaded == false){
        this.initProviders();
      }
      return  this.providers;
    },

    initProviders():void{
      providerService.collection({start:0, limit: -1, sort:[], enabled:null}).then((response: AxiosResponse)=>{
        this.providers = response.data.data;
        this.loaded = true;
      })
    }
  }
})
