import {defineStore} from "pinia";

interface apiState {
  loading: boolean;
  error:{
    code: number,
    message: string,
  }|null,
  showError: boolean
}

export const useApiStore = defineStore('api',{
  state: (): apiState => ({
    loading: false,
    error: null,
    showError: false
  }),
  actions: {
    setLoadingStart():void{
      this.loading = true
    },
    setLoaded():void{
      this.loading = false
    },
    setError(error:{code:number, message:string}):void{
      this.loading = false
      this.error = error
      this.showError = true
    },
    eraseError():void{
      this.error = null
      this.showError = false
    }
  }
});
