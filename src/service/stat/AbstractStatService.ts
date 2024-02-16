import StatQueryInterface from "@/interface/StatQueryInterface";
import {AxiosResponse} from "axios";
import http from "@/service/rest";

export default abstract class AbstractStatService {
  query(query: StatQueryInterface): Promise<AxiosResponse>{
    return http.get(this.getPath(), {params:query});
  }
  abstract getPath():string
}
