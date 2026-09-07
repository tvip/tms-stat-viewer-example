import {defineStore} from "pinia";
import {Provider} from "@/dto/provider/Provider";
import providerService from "@/service/provider/ProviderService";
interface State{
  loaded: boolean;
  providers: Provider[]
}

let initPromise: Promise<void>|null = null;

export const useProviderStore = defineStore('providerStore',{
  state: (): State => ({
    providers: [],
    loaded:false
  }),
  actions: {
    setProviders(providers: Provider[]):void{
      this.providers = providers;
      this.loaded = true;
    },
    getProviders():Provider[]{
      if(this.loaded == false){
        this.initProviders();
      }
      return  this.providers;
    },

    /**
     * Loads all providers page by page; repeated calls while loading share one request
     * (getProviders() is evaluated on every render of the provider selector).
     */
    initProviders():Promise<void>{
      if(initPromise === null){
        initPromise = providerService.collectionAll<Provider>({sort:[], enabled:null}).then((providers: Provider[])=>{
          this.setProviders(providers);
        }).catch((error)=>{
          initPromise = null;
          throw error;
        });
      }
      return initPromise;
    }
  }
})
