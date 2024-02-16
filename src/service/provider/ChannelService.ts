import AbstractProviderService from "@/service/provider/AbstractProviderService";

class ChannelService extends AbstractProviderService {
  getPath(): string {
    return "/api/provider/channels/";
  }
}

export default new ChannelService();
