import http from "@/service/rest";
import ProviderApiQueryInterface from "@/interface/ProviderApiQueryInterface";
import {AxiosResponse} from "axios";
import {fetchAllPages, PageResponse} from "@/service/provider/paginate";

export type ListQuery = Omit<ProviderApiQueryInterface, 'start'|'limit'>;

export default abstract class AbstractProviderService {
  abstract getPath():string
  collection(query:ProviderApiQueryInterface):Promise<AxiosResponse>{
    return http.get(this.getPath(), {params:query});
  }

  /**
   * Loads the whole list page by page (the API caps a single page, see `total` in the response).
   */
  collectionAll<T>(query: ListQuery, pageSize: number = 500): Promise<T[]>{
    return fetchAllPages<T>((start: number, limit: number) => {
      return this.collection({...query, start: start, limit: limit}).then((response: AxiosResponse) => {
        return response.data as PageResponse<T>;
      });
    }, pageSize);
  }
}
