import axios, {AxiosError, AxiosInstance} from "axios";
import {useAppStore} from "@/store/app";
import router from "@/router";
import {useApiStore} from "@/store/api";
import {LogLevel, useLogStore} from "@/store/log";

const app = useAppStore();

const apiStore = useApiStore();
const logStore = useLogStore();
const http:AxiosInstance = axios.create({
  baseURL: app.target,
  timeout: 60000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Accept':'application/json',
    'Authorization':`Basic ${app.token}`
  },
})
http.interceptors.request.use(function (config){
  logStore.addLog('requested '+ config.url + JSON.stringify(config.params))
  apiStore.setLoadingStart();
  return config;
})

http.interceptors.response.use(function (response){
  logStore.addLog('loaded data from '+ response.config.url + JSON.stringify(response.config.params))
  apiStore.setLoaded();
  return response
},function (error:AxiosError){
  logStore.addLog('failed load from '+ error.response?.config.url + JSON.stringify(error.response?.config.params), LogLevel.warning)
  if(error.response){
    if(error.response.status > 400 && error.response.status < 404){
      if(router.currentRoute.value.name !== 'login'){
        router.replace('login');
      }
    }
  }

  if(error.response){
    apiStore.setError({code: error.response.status, message:error.response.statusText})
  }else{
    apiStore.setError({code: 999, message:'app.common.unknown_error'})
  }
  apiStore.setLoaded();
  throw  error;
})
export default http
