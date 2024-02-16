import http from "@/service/rest";
import ProviderApiQueryInterface from "@/interface/ProviderApiQueryInterface";
import {AxiosResponse} from "axios";

export default abstract class AbstractProviderService {
  abstract getPath():string
  collection(query:ProviderApiQueryInterface):Promise<AxiosResponse>{
    return http.get(this.getPath(), {params:query});
  }
}
