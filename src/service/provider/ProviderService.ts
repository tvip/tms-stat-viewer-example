import AbstractProviderService from "@/service/provider/AbstractProviderService";
import ProviderApiQueryInterface from "@/interface/ProviderApiQueryInterface";
import {AxiosResponse} from "axios";
interface ProviderQuery extends ProviderApiQueryInterface{
  enabled: boolean|null;
}
class ProviderService extends AbstractProviderService {
  getPath(): string {
    return "/api/provider/providers/";
  }

  collection(query: ProviderQuery): Promise<AxiosResponse> {
    return super.collection(query);
  }
}

export default new  ProviderService();
