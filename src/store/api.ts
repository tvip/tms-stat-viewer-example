import {defineStore} from "pinia";

interface apiState {
  /** true while at least one request is in flight */
  loading: boolean;
  pending: number;
  error:{
    code: number,
    message: string,
  }|null,
  showError: boolean
}

export const useApiStore = defineStore('api',{
  state: (): apiState => ({
    loading: false,
    pending: 0,
    error: null,
    showError: false
  }),
  actions: {
    setLoadingStart():void{
      this.pending++;
      this.loading = true
    },
    setLoaded():void{
      this.pending = Math.max(0, this.pending - 1);
      this.loading = this.pending > 0
    },
    setError(error:{code:number, message:string}):void{
      this.error = error
      this.showError = true
    },
    eraseError():void{
      this.error = null
      this.showError = false
    }
  }
});
