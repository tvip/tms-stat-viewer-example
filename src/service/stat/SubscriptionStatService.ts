import AbstractStatService from "@/service/stat/AbstractStatService";

class SubscriptionStatService extends AbstractStatService {
  getPath(): string {
    return "/api/stats/subscription/";
  }

}
